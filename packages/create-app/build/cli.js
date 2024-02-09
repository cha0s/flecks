#!/usr/bin/env node

const {stat} = require('fs/promises');
const {join} = require('path');

const {move} = require('@flecks/core/build/move');
const {
  build,
  install,
  YamlStream,
} = require('@flecks/core/src/server');
const {program} = require('commander');
const validate = require('validate-npm-package-name');

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
      try {
        await stat(destination);
        const error = new Error(
          `@flecks/create-app: destination '${destination} already exists: aborting`,
        );
        error.code = 129;
        throw error;
      }
      // eslint-disable-next-line no-empty
      catch (error) {}
      const fileTree = await move(name, join(__dirname, '..', 'template'));
      fileTree.pipe(
        'build/flecks.yml',
        new YamlStream(
          (yml) => ({...yml, '@flecks/core': {id: app}}),
          {dump: {forceQuotes: true, sortKeys: true}},
        ),
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
