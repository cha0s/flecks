const {stat, unlink} = require('fs/promises');
const {join} = require('path');

// eslint-disable-next-line import/no-extraneous-dependencies
const {commands: coreCommands} = require('@flecks/build/build/commands');
const {D} = require('@flecks/core');
const {glob} = require('@flecks/core/server');
const chokidar = require('chokidar');
const clearModule = require('clear-module');
const Mocha = require('mocha');

const debug = D('@flecks/build.commands');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

module.exports = (program, flecks) => {
  const commands = {};
  commands.test = {
    options: [
      program.createOption('-d, --no-production', 'dev build'),
      program.createOption('-w, --watch', 'watch for changes'),
      program.createOption('-v, --verbose', 'verbose output'),
    ],
    description: [
      'Run tests.',
      '',
      'The options are passed along to the `build` command.',
    ].join('\n'),
    action: async (opts) => {
      const {
        watch,
      } = opts;
      const {build} = coreCommands(program, flecks);
      const child = await build.action(undefined, opts);
      const testPaths = await glob(join(FLECKS_CORE_ROOT, 'test/**/*.js'));
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
      require('@flecks/build/build/resolve')(flecks.resolver, flecks.stubs);
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
