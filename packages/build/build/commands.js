const {
  access,
  constants: {R_OK, W_OK},
  readFile,
  writeFile,
} = require('fs/promises');
const {
  dirname,
  join,
  resolve,
} = require('path');

const {parseAsync} = require('@babel/core');
const {default: generate} = require('@babel/generator');
const {default: traverse} = require('@babel/traverse');
const {
  isIdentifier,
  isMemberExpression,
  isStringLiteral,
  stringLiteral,
} = require('@babel/types');
const addPathsToYml = require('@flecks/core/build/add-paths-to-yml');
const D = require('@flecks/core/build/debug');
const {
  add,
  binaryPath,
  loadYml,
  lockFile,
  spawnWith,
} = require('@flecks/core/src/server');
const chokidar = require('chokidar');
const {glob} = require('glob');
const {paperwork} = require('precinct');
const {rimraf} = require('rimraf');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const debug = D('@flecks/build/build/commands');

// Find `exports.dependencies = ...`.
const dependenciesVisitor = (fn) => ({
  AssignmentExpression: (path) => {
    if (isMemberExpression(path.node.left)) {
      if (isIdentifier(path.node.left.object)) {
        if ('exports' === path.node.left.object.name) {
          if (isIdentifier(path.node.left.property)) {
            if ('dependencies' === path.node.left.property.name) {
              fn(path.node.right);
            }
          }
        }
      }
    }
  },
});

function stringLiteralSinglequote(value) {
  return {
    ...stringLiteral(value),
    extra: {rawValue: value, raw: `'${value}'`},
  };
}

const dependencies = {};

async function gatherDependencies(request, resolver) {
  const resolved = await resolver.resolve(request);
  if (!resolved || dependencies[resolved]) {
    return;
  }
  try {
    const localDeps = paperwork(resolved);
    dependencies[resolved] = true;
    await Promise.all(
      localDeps.map(
        async (dependency) => {
          const resolvedDependency = await resolver.resolve(
            resolve(dirname(resolved), dependency),
          );
          return resolvedDependency && gatherDependencies(resolvedDependency, resolver);
        },
      ),
    );
  }
  // eslint-disable-next-line no-empty
  catch (error) {}
}

async function rootsDependencies(roots, resolver) {
  return Promise.all(
    roots.map(([request]) => (
      gatherDependencies(join(request, 'build', 'flecks.bootstrap.js'), resolver)
    )),
  );
}

exports.commands = (program, flecks) => {
  const commands = {
    add: {
      args: [
        program.createArgument('<packages...>', 'packages to add'),
      ],
      options: [
        program.createOption('-d, --dev-dependency', 'add to dev dependencies'),
        program.createOption('-pm,--package-manager <binary>', 'package manager binary')
          .choices(['npm', 'bun', 'pnpm', 'yarn']),
      ],
      description: 'Add flecks to your application.',
      action: async (packages, {devDependency, packageManager}) => {
        await add({
          dev: devDependency,
          packageManager,
          packages,
        });
        // If it seems like we're in a fleck path, update the bootstrap dependencies if possible.
        const bootstrapPath = join(FLECKS_CORE_ROOT, 'build', 'flecks.bootstrap.js');
        let code;
        let packageDependencies;
        try {
          const {dependencies, devDependencies} = require(join(FLECKS_CORE_ROOT, 'package.json'));
          packageDependencies = [].concat(Object.keys(dependencies), Object.keys(devDependencies));
        }
        catch (error) {
          packageDependencies = [];
        }
        // Try loading the bootstrap script.
        if (packageDependencies.includes('@flecks/fleck')) {
          try {
            // eslint-disable-next-line no-bitwise
            await access(bootstrapPath, R_OK | W_OK);
            code = (await readFile(bootstrapPath)).toString();
          }
          catch (error) { /* empty */ }
        }
        if ('undefined' !== typeof code) {
          // Parse the script and find `exports.dependencies`.
          const ast = await parseAsync(code, {ast: true, code: false});
          let dependencies;
          traverse(ast, dependenciesVisitor((node) => {
            dependencies = node;
          }));
          if (dependencies) {
            const {elements, end, start} = dependencies;
            const seen = {};
            // Add the fleck to dependencies.
            dependencies.elements = elements
              .concat(packages.map((fleck) => stringLiteralSinglequote(fleck)))
              // Filter duplicate literal strings.
              .filter((node) => {
                if (isStringLiteral(node)) {
                  if (seen[node.value]) {
                    return false;
                  }
                  seen[node.value] = true;
                }
                return true;
              });
            // Be surgical, don't generate the whole file. Splice the new dependencies in.
            code = [
              code.slice(0, start),
              generate(dependencies).code,
              code.slice(end),
            ].join('');
          }
          // No dependencies, append some.
          else {
            code = [
              code,
              `exports.dependencies = ['${packages.join("', '")}'];\n`,
            ].join('\n');
          }
          await writeFile(bootstrapPath, code);
        }
        // Otherwise, assume we're in an application root.
        else {
          await addPathsToYml(packages);
        }
      },
    },
    clean: {
      description: 'Remove node_modules, lock file, and build artifacts.',
      options: [
        program.createOption('-pm,--package-manager <binary>', 'package manager binary')
          .choices(['npm', 'bun', 'pnpm', 'yarn']),
      ],
      action: async ({packageManager}) => {
        await Promise.all([
          rimraf(join(FLECKS_CORE_ROOT, 'dist')),
          rimraf(join(FLECKS_CORE_ROOT, 'node_modules')),
          rimraf(join(FLECKS_CORE_ROOT, lockFile(packageManager))),
        ]);
      },
    },
  };
  const {targets} = flecks;
  if (targets.length > 0) {
    commands.build = {
      args: [
        program.createArgument('[target]', 'build target')
          .choices(targets.map(([, target]) => target)),
      ],
      options: [
        program.createOption('-d, --no-production', 'dev build'),
        program.createOption('-h, --hot', 'build with hot module reloading')
          .implies({production: false, watch: true}),
        program.createOption('-w, --watch', 'watch for changes')
          .implies({production: false}),
      ],
      description: 'Build a target in your application.',
      action: async (target, opts) => {
        const {
          hot,
          production,
          watch,
          ...rest
        } = opts;
        if (watch) {
          debug('Watching...', opts);
        }
        else {
          debug('Building...', opts);
        }
        const webpackConfig = await flecks.resolveBuildConfig('fleckspack.config.js');
        const cmd = [
          await binaryPath('webpack', '@flecks/build'),
          ...((watch || hot) ? ['watch'] : []),
          '--config', webpackConfig,
          '--mode', (production && !hot) ? 'production' : 'development',
        ];
        const options = {
          // @todo This kills the pnpm. Let's use a real IPC channel.
          useFork: true,
          ...rest,
          env: {
            FLECKS_BUILD_IS_PRODUCTION: production,
            ...(target ? {FLECKS_CORE_BUILD_LIST: target} : {}),
            ...(hot ? {FLECKS_ENV__flecks_server__hot: 'true'} : {}),
            ...rest.env,
          },
        };
        if (!watch) {
          return spawnWith(cmd, options);
        }
        await rootsDependencies(flecks.roots, flecks.resolver);
        const watched = Object.keys(dependencies);
        watched.push(
          ...await Promise.all(
            flecks.roots.map(([, request]) => flecks.resolver.resolve(join(request, 'package.json'))),
          ),
        );
        watched.push(join(FLECKS_CORE_ROOT, 'build/flecks.yml'));
        const watcher = chokidar.watch(watched, {
          awaitWriteFinish: {
            stabilityThreshold: 50,
            pollInterval: 5,
          },
        });
        let webpack;
        const spawnWebpack = () => {
          webpack = spawnWith(cmd, options);
          webpack.on('message', (message) => {
            switch (message) {
              case 'kill':
                debug('killing...');
                webpack.kill();
                watcher.close();
                break;
              case 'restart':
                debug('restarting webpack...');
                webpack.kill();
                spawnWebpack();
                break;
              default:
            }
          });
        };
        spawnWebpack();
        await new Promise((resolve, reject) => {
          watcher.on('error', reject);
          watcher.on('ready', resolve);
        });
        const configPath = join(FLECKS_CORE_ROOT, 'build', 'flecks.yml');
        const initialConfig = loadYml(await readFile(configPath));
        watcher.on('all', async (event, path) => {
          let respawn = false;
          if (configPath === path) {
            const config = loadYml(await readFile(configPath));
            if (
              JSON.stringify(Object.keys(initialConfig).sort())
              !== JSON.stringify(Object.keys(config).sort())
            ) {
              debug('Config keys changed');
              respawn = true;
            }
          }
          else {
            respawn = true;
          }
          if (respawn) {
            debug('restarting webpack...');
            webpack.kill();
            spawnWebpack();
          }
        });
        // Persist...
        return new Promise(() => {});
      },
    };
  }
  commands.lint = {
    description: 'Run ESLint.',
    args: [],
    action: async () => {
      const promises = [];
      const packages = await glob(join('packages', '*'));
      if (0 === packages.length) {
        packages.push('.');
      }
      await Promise.all(
        packages
          .map((pkg) => join(process.cwd(), pkg))
          .map(async (cwd) => {
            const cmd = [
              await binaryPath('eslint', '@flecks/build'),
              '--config', await flecks.resolveBuildConfig('eslint.config.js'),
              '.',
            ];
            promises.push(new Promise((resolve, reject) => {
              const child = spawnWith(
                cmd,
                {
                  cwd,
                  env: {
                    FLECKS_BUILD_ESLINT_NO_CACHE: true,
                    FLECKS_CORE_ROOT,
                  },
                },
              );
              child.on('error', reject);
              child.on('exit', (code) => {
                child.off('error', reject);
                resolve(code);
              });
            }));
          }),
      );
      const promise = Promise.all(promises)
        .then(
          (codes) => (
            codes.every((code) => 0 === parseInt(code, 10))
              ? 0
              : codes.find((code) => code !== 0)
          ),
        );
      return {
        off: () => {},
        on: (type, fn) => {
          if ('error' === type) {
            promise.catch(fn);
          }
          else if ('exit' === type) {
            promise.then(fn);
          }
        },
      };
    },
  };
  return commands;
};
