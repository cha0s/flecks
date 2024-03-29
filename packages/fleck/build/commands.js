const {access} = require('fs/promises');
const {join} = require('path');
const {PassThrough} = require('stream');

const {hook: coreCommands} = require('@flecks/build/build/hooks/@flecks/build.commands');
const {rimraf} = require('@flecks/build/src/server');
const D = require('@flecks/core/build/debug');
const {glob, pipesink, processCode} = require('@flecks/core/src/server');
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
      program.createOption('-s, --subdirectory [subdirectories...]', 'subdirectories to test')
        .default(['.']),
      program.createOption('-t, --timeout <ms>', 'timeout').default(2000),
      program.createOption('-v, --verbose', 'verbose output'),
      program.createOption('-w, --watch', 'watch for changes'),
    ],
    description: [
      'Run tests.',
      '',
      'The options are passed along to the `build` command.',
    ].join('\n'),
    action: async (only, opts) => {
      const {
        subdirectory: subdirectories,
        production,
        timeout,
        watch,
      } = opts;
      const {build} = coreCommands(program, flecks);
      // Check for work.
      const [env, argv] = [{}, {mode: production ? 'production' : 'development'}];
      process.env.FLECKS_CORE_TEST_SUBDIRECTORIES = JSON.stringify(subdirectories);
      const filename = await flecks.resolveBuildConfig('test.webpack.config.js', '@flecks/build');
      const config = {test: await require(filename)(env, argv, flecks)};
      await flecks.configureBuilds(config, env, argv);
      if (0 === Object.entries(config.test.entry).length) {
        return undefined;
      }
      // Remove the previous test(s).
      await rimraf(join(FLECKS_CORE_ROOT, 'dist', 'test'));
      // Kick off building the test and wait for the file to exist.
      const child = await build.action(
        'test',
        {
          env: {
            DEBUG_COLORS: process.stdout.isTTY,
            FORCE_COLOR: process.stdout.isTTY,
          },
          production,
          stdio: watch ? 'inherit' : 'pipe',
          watch,
        },
      );
      if (!watch) {
        const stdio = pipesink(child.stderr.pipe(child.stdout.pipe(new PassThrough())));
        if (0 !== await processCode(child)) {
          const buffer = await stdio;
          if (!process.stdout.write(buffer)) {
            await new Promise((resolve, reject) => {
              process.stdout.on('error', reject);
              process.stdout.on('drain', resolve);
            });
          }
          program.error('\nbuilding tests failed!\n');
        }
      }
      debug('Testing...', opts);
      while (watch) {
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
      let files = await glob(join(FLECKS_CORE_ROOT, 'dist', 'test', '**', '*.js'));
      if (0 === files.length) {
        return undefined;
      }
      if (only) {
        const index = files.indexOf(join(FLECKS_CORE_ROOT, 'dist', only));
        if (-1 !== index) {
          files = [files[index]];
        }
        else {
          throw new Error(`Test '${only}' does not exist!`);
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
