#!/usr/bin/env node

const {join} = require('path');

const {
  build,
  install,
  transform,
} = require('@flecks/core/server');
const {program} = require('commander');
const {dump: dumpYml, load: loadYml} = require('js-yaml');
const validate = require('validate-npm-package-name');

// const build = require('./build');
const {move, testDestination} = require('./move');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

(async () => {
  program.argument('<app>', 'name of the app to create');
  program.addOption(
    program.createOption('-pm,--package-manager <binary>', 'package manager binary')
      .choices(['npm', 'bun', 'pnpm', 'yarn']),
  );
  program.action(async (app, {packageManager}) => {
    try {
      const {errors} = validate(app);
      if (errors) {
        throw new Error(`@flecks/create-app: invalid app name: ${errors.join(', ')}`);
      }
      const destination = join(FLECKS_CORE_ROOT, app);
      const name = app.startsWith('@') ? app : `@${app}/monorepo`;
      if (!await testDestination(destination)) {
        const error = new Error(
          `@flecks/create-app: destination '${destination} already exists: aborting`,
        );
        error.code = 129;
        throw error;
      }
      const fileTree = await move(name, join(__dirname, '..', 'template'));
      fileTree.pipe(
        'build/flecks.yml',
        transform((chunk, encoding, done, stream) => {
          const yml = loadYml(chunk);
          yml['@flecks/core'].id = app;
          stream.push(dumpYml(yml, {forceQuotes: true, sortKeys: true}));
          done();
        }),
      );
      // Write the tree.
      await fileTree.writeTo(destination);
      await install({cwd: destination, packageManager});
      await build({cwd: destination, packageManager});
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  });
  await program.parseAsync(process.argv);
})();
