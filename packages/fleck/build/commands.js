const {stat, unlink} = require('fs/promises');
const {join} = require('path');

const {commands: coreCommands} = require('@flecks/build/build/commands');
const {D} = require('@flecks/core/src');
const {glob} = require('@flecks/core/src/server');
const Mocha = require('mocha');
const {watchParallelRun} = require('mocha/lib/cli/watch-run');

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
      const testPaths = await glob(join(FLECKS_CORE_ROOT, 'test/**/*.js'));
      if (0 === testPaths.length) {
        // eslint-disable-next-line no-console
        console.log('No tests found.');
        return;
      }
      // Remove the previous test.
      const testLocation = join(FLECKS_CORE_ROOT, 'dist', 'test.js');
      try {
        await unlink(testLocation);
      }
      // eslint-disable-next-line no-empty
      catch (error) {}
      // Kick off building the test and wait for the file to exist.
      await build.action('test', opts);
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
      // Magic.
      require('@flecks/core/build/resolve')(
        {
          alias: flecks.resolver.aliases,
          fallback: flecks.resolver.fallbacks,
        },
        flecks.stubs,
      );
      const mocha = new Mocha({parallel: true});
      mocha.ui('bdd');
      if (watch) {
        watchParallelRun(mocha, {watchFiles: [testLocation]}, {file: [testLocation], spec: []});
        return new Promise(() => {});
      }
      mocha.files = [testLocation];
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
    },
  };
  return commands;
};
