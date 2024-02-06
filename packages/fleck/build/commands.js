const {access} = require('fs/promises');
const {join, relative} = require('path');

const {commands: coreCommands} = require('@flecks/build/build/commands');
const {rimraf} = require('@flecks/build/src/server');
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
    args: [
      program.createArgument('[only]', 'only run a specific test'),
    ],
    options: [
      program.createOption('-d, --no-production', 'dev build'),
      program.createOption('-t, --timeout <ms>', 'timeout').default(2000),
      program.createOption('-w, --watch', 'watch for changes'),
      program.createOption('-v, --verbose', 'verbose output'),
    ],
    description: [
      'Run tests.',
      '',
      'The options are passed along to the `build` command.',
    ].join('\n'),
    action: async (only, opts) => {
      const {
        timeout,
        watch,
      } = opts;
      const {build} = coreCommands(program, flecks);
      const tests = await glob(join(FLECKS_CORE_ROOT, 'test', '*.js'));
      const serverTests = await glob(join(FLECKS_CORE_ROOT, 'test', 'server', '*.js'));
      let files = []
        .concat(tests, serverTests)
        .map((path) => relative(FLECKS_CORE_ROOT, path));
      if (0 === files.length) {
        // eslint-disable-next-line no-console
        console.log('No tests found.');
        return undefined;
      }
      if (only) {
        if (files.includes(only)) {
          files = [only];
        }
        else {
          throw new Error(`Test '${only}' does not exist!`);
        }
      }
      files = files.map((file) => join('dist', file));
      // Remove the previous test.
      await rimraf(join(FLECKS_CORE_ROOT, 'dist', 'test'));
      // Kick off building the test and wait for the file to exist.
      await build.action('test', opts);
      debug('Testing...', opts);
      // eslint-disable-next-line no-constant-condition
      while (true) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await access(join(FLECKS_CORE_ROOT, 'dist', 'test'));
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
      const mocha = new Mocha({parallel: true, timeout});
      mocha.ui('bdd');
      if (watch) {
        watchParallelRun(
          mocha,
          {
            watchFiles: files,
          },
          {
            file: files,
            spec: [],
          },
        );
        return new Promise(() => {});
      }
      mocha.files = files;
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
