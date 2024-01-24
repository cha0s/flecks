const {spawn} = require('child_process');
const {join, normalize} = require('path');

const D = require('@flecks/core/build/debug');
const {processCode, spawnWith} = require('@flecks/core/server');
const {Argument, Option, program} = require('commander');
const {glob} = require('glob');
const rimraf = require('rimraf');

const addFleckToYml = require('./add-fleck-to-yml');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const debug = D('@flecks/build/build/commands');
const flecksRoot = normalize(FLECKS_CORE_ROOT);

exports.commands = (program, flecks) => {
  const {packageManager} = flecks.get('@flecks/build');
  const commands = {
    add: {
      args: [
        new Argument('<fleck>', 'fleck'),
      ],
      options: [
        program.createOption('-d, --dev-dependency', 'add to dev dependencies'),
      ],
      description: 'Add a fleck to your application.',
      action: async (fleck, {devDependency}) => {
        const args = [];
        if (['bun', 'yarn'].includes(packageManager)) {
          args.push(packageManager, ['add', ...(devDependency ? ['-d'] : []), fleck]);
        }
        else {
          args.push(packageManager, ['install', ...(devDependency ? ['--save-dev'] : []), fleck]);
        }
        args.push({stdio: 'inherit'});
        await processCode(spawn(...args));
        await addFleckToYml(fleck);
      },
    },
    clean: {
      description: 'Remove node_modules, lock file, and build artifacts.',
      action: () => {
        rimraf.sync(join(flecksRoot, 'dist'));
        rimraf.sync(join(flecksRoot, 'node_modules'));
        switch (packageManager) {
          case 'yarn':
            rimraf.sync(join(flecksRoot, 'yarn.lock'));
            break;
          case 'bun':
            rimraf.sync(join(flecksRoot, 'bun.lockb'));
            break;
          case 'npm':
            rimraf.sync(join(flecksRoot, 'package-lock.json'));
            break;
          default:
            break;
        }
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
          .implies({production: false}),
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
                  env: {FLECKS_CORE_ROOT},
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

exports.Argument = Argument;
exports.Option = Option;
exports.program = program;
