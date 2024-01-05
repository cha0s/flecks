import {join} from 'path';

import {
  dumpYml,
  Flecks,
  loadYml,
  Option,
  program,
  transform,
} from '@flecks/core/server';
import validate from 'validate-npm-package-name';

import build from './build';
import move, {testDestination} from './move';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

(async () => {
  program.argument('<app>', 'name of the app to create');
  program.addOption(
    new Option('--package-manager <binary>', 'package manager binary')
      .choices(['npm', 'bun', 'yarn'])
      .default('npm'),
  );
  program.action(async (app, {packageManager}) => {
    const flecks = await Flecks.bootstrap({
      config: {
        '@flecks/core': {},
        '@flecks/core/server': {packageManager},
        '@flecks/create-app': {},
        '@flecks/fleck': {},
      },
    });
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
      const fileTree = await move(name, join(__dirname, 'template'), 'app', flecks);
      fileTree.pipe(
        'build/flecks.yml',
        transform((chunk, encoding, done, stream) => {
          const yml = loadYml(chunk);
          if ('npm' !== packageManager) {
            yml['@flecks/core/server'] = {packageManager};
          }
          yml['@flecks/core'] = {id: app};
          stream.push(dumpYml(yml, {forceQuotes: true, sortKeys: true}));
          done();
        }),
      );
      // Write the tree.
      await fileTree.writeTo(destination);
      await build(packageManager, destination);
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  });
  await program.parseAsync(process.argv);
})();
