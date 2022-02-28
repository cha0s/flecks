import {stat, unlink} from 'fs/promises';
import {join} from 'path';

import chokidar from 'chokidar';
import D from 'debug';
import glob from 'glob';

import {
  commands as coreCommands,
  spawnWith,
} from '@flecks/core/server';

const debug = D('@flecks/core/commands');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

export default (program, flecks) => {
  const commands = {};
  commands.test = {
    options: [
      ['-d, --no-production', 'dev build'],
      ['-w, --watch', 'watch for changes'],
      ['-v, --verbose', 'verbose output'],
    ],
    description: 'run tests',
    action: async (opts) => {
      const {
        watch,
      } = opts;
      const testPaths = glob.sync(join(FLECKS_CORE_ROOT, 'test/*.js'));
      if (0 === testPaths.length) {
        // eslint-disable-next-line no-console
        console.log('No fleck tests found.');
        return 0;
      }
      const testLocation = join(FLECKS_CORE_ROOT, 'dist', 'test.js');
      if (watch) {
        await unlink(testLocation);
      }
      const {build} = coreCommands(program, flecks);
      const child = build.action(undefined, opts);
      debug('Testing...', opts);
      // eslint-disable-next-line no-constant-condition
      while (true) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await stat(testLocation);
          break;
        }
        catch (error) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
      }
      const spawnMocha = () => {
        const localEnv = {};
        const spawnArgs = [
          '--colors',
          '--reporter', 'min',
          testLocation,
        ];
        return spawnWith('mocha', localEnv, spawnArgs);
      };
      if (!watch) {
        await new Promise((resolve, reject) => {
          child.on('exit', (code) => {
            if (code !== 0) {
              reject(code);
              return;
            }
            resolve();
          });
          child.on('error', reject);
        });
        return spawnMocha();
      }
      let tester;
      chokidar.watch(testLocation)
        .on('all', () => {
          if (tester) {
            tester.kill();
          }
          tester = spawnMocha();
        });
      return new Promise(() => {});
    },
  };
  return commands;
};
