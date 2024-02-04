const {
  access,
  constants: {R_OK, W_OK},
  readFile,
  writeFile,
} = require('fs/promises');
const {join} = require('path');

const {parseAsync} = require('@babel/core');
const {default: generate} = require('@babel/generator');
const {default: traverse} = require('@babel/traverse');
const {
  isIdentifier,
  isMemberExpression,
  isStringLiteral,
  stringLiteral,
} = require('@babel/types');
const D = require('@flecks/core/build/debug');
const {
  add,
  lockFile,
  spawnWith,
} = require('@flecks/core/src/server');
const {glob} = require('glob');
const rimraf = require('rimraf');

const addPathsToYml = require('./add-paths-to-yml');

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
        } = opts;
        debug('Building...', opts);
        const webpackConfig = await flecks.resolveBuildConfig('fleckspack.config.js');
        const cmd = [
          'npx', 'webpack',
          '--config', webpackConfig,
          '--mode', (production && !hot) ? 'production' : 'development',
          ...((watch || hot) ? ['--watch'] : []),
        ];
        return spawnWith(
          cmd,
          {
            env: {
              FLECKS_CORE_IS_PRODUCTION: production,
              ...(target ? {FLECKS_CORE_BUILD_LIST: target} : {}),
              ...(hot ? {FLECKS_ENV__flecks_server__hot: 'true'} : {}),
            },
          },
        );
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
              'npx', 'eslint',
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
