import {spawn} from 'child_process';
import {join, normalize} from 'path';

import {Argument} from 'commander';
import flatten from 'lodash.flatten';
import rimraf from 'rimraf';

import D from '../debug';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const debug = D('@flecks/core/commands');
const debugSilly = debug.extend('silly');
const flecksRoot = normalize(FLECKS_CORE_ROOT);

export const processCode = (child) => new Promise((resolve, reject) => {
  child.on('error', reject);
  child.on('exit', (code) => {
    child.off('error', reject);
    resolve(code);
  });
});

export const spawnWith = (cmd, opts = {}) => {
  debug("spawning: '%s'", cmd.join(' '));
  debugSilly('with options: %O', opts);
  const child = spawn(cmd[0], cmd.slice(1), {
    ...opts,
    env: {
      ...process.env,
      ...(opts.env || {}),
    },
  });
  child.stderr.pipe(process.stderr);
  child.stdout.pipe(process.stdout);
  return child;
};

export default (program, flecks) => {
  const commands = {
    clean: {
      description: 'remove node_modules, lock file, build artifacts, then reinstall',
      action: (opts) => {
        const {
          noYarn,
        } = opts;
        rimraf.sync(join(flecksRoot, 'dist'));
        rimraf.sync(join(flecksRoot, 'node_modules'));
        if (noYarn) {
          rimraf.sync(join(flecksRoot, 'package-lock.json'));
          return spawn('npm', ['install'], {stdio: 'inherit'});
        }
        rimraf.sync(join(flecksRoot, 'yarn.lock'));
        return spawn('yarn', [], {stdio: 'inherit'});
      },
      options: [
        ['--no-yarn', 'use npm instead of yarn'],
      ],
    },
  };
  const targets = flatten(flecks.invokeFlat('@flecks/core.targets'));
  if (targets.length > 0) {
    commands.build = {
      args: [
        new Argument('[target]', 'target').choices(targets),
      ],
      options: [
        ['-d, --no-production', 'dev build'],
        ['-h, --hot', 'build with hot module reloading'],
        ['-w, --watch', 'watch for changes'],
      ],
      description: 'build',
      action: (target, opts) => {
        const {
          hot,
          production,
          watch,
        } = opts;
        debug('Building...', opts);
        const webpackConfig = flecks.buildConfig('fleckspack.config.js');
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
              ...(target ? {FLECKS_CORE_BUILD_LIST: target} : {}),
              ...(hot ? {FLECKS_ENV_FLECKS_SERVER_hot: 'true'} : {}),
            },
          },
        );
      },
    };
    commands.lint = {
      description: 'run linter',
      args: [
        program.createArgument('[target]', 'target').choices(targets),
      ],
      action: (targetArgument) => {
        const promises = [];
        for (let i = 0; i < targets.length; ++i) {
          const target = targets[i];
          if (targetArgument && targetArgument !== target) {
            // eslint-disable-next-line no-continue
            continue;
          }
          process.env.FLECKS_CORE_BUILD_TARGET = target;
          const cmd = [
            'npx', 'eslint',
            '--config', flecks.buildConfig('.eslintrc.js', target),
            '--format', 'codeframe',
            '--ext', 'js',
            '.',
          ];
          promises.push(new Promise((resolve, reject) => {
            const child = spawnWith(
              cmd,
              {
                env: {
                  FLECKS_CORE_BUILD_TARGET: target,
                },
              },
            );
            child.on('error', reject);
            child.on('exit', (code) => {
              child.off('error', reject);
              resolve(code);
            });
          }));
        }
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
  }
  return commands;
};
