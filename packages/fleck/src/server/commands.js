import {stat, unlink} from 'fs/promises';
import {join} from 'path';

import {D} from '@flecks/core';
import chokidar from 'chokidar';
import clearModule from 'clear-module';
import glob from 'glob';
import Mocha from 'mocha';

import {commands as coreCommands} from '@flecks/core/server';

const debug = D('@flecks/core.commands');

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
      const {build} = coreCommands(program, flecks);
      const child = build.action(undefined, opts);
      const testPaths = glob.sync(join(FLECKS_CORE_ROOT, 'test/*.js'));
      if (0 === testPaths.length) {
        // eslint-disable-next-line no-console
        console.log('No fleck tests found.');
        return child;
      }
      const testLocation = join(FLECKS_CORE_ROOT, 'dist', 'test.js');
      if (watch) {
        await unlink(testLocation);
      }
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
          await new Promise((resolve) => {
            setTimeout(resolve, 50);
          });
        }
      }
      const runMocha = async () => {
        const mocha = new Mocha();
        mocha.ui('bdd');
        clearModule(testLocation);
        mocha.addFile(testLocation);
        mocha.loadFiles();
        return new Promise((r, e) => {
          mocha.run((code) => {
            if (!code) {
              r();
              return;
            }
            const error = new Error('Tests failed');
            error.code = code;
            e(error);
          });
        });
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
        await runMocha();
        return 0;
      }
      chokidar.watch(testLocation)
        .on('all', async () => {
          await new Promise((resolve) => {
            setTimeout(resolve, 50);
          });
          runMocha();
        });
      return new Promise(() => {});
    },
  };
  return commands;
};
