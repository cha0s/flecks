import {stat} from 'fs/promises';
import {join} from 'path';

import {
  build,
  move,
  testDestination,
  validate,
} from '@flecks/create-app/server';
import {Flecks, program} from '@flecks/core/server';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const checkIsMonorepo = async () => {
  try {
    await stat(join(FLECKS_CORE_ROOT, 'packages'));
    return true;
  }
  catch (error) {
    if ('ENOENT' !== error.code) {
      throw error;
    }
    return false;
  }
};

const monorepoScope = async () => {
  try {
    const {name} = __non_webpack_require__(join(FLECKS_CORE_ROOT, 'package.json'));
    const [scope] = name.split('/');
    return scope;
  }
  catch (error) {
    if ('MODULE_NOT_FOUND' !== error.code) {
      throw error;
    }
    return undefined;
  }
};

const target = async (fleck) => {
  const {errors} = validate(fleck);
  if (errors) {
    throw new Error(`@flecks/create-fleck: invalid fleck name: ${errors.join(', ')}`);
  }
  const parts = fleck.split('/');
  let pkg;
  let scope;
  if (1 === parts.length) {
    pkg = fleck;
    if (await checkIsMonorepo()) {
      scope = await monorepoScope();
    }
    return [scope, pkg];
  }
  return parts;
};

(async () => {
  program.argument('<fleck>', 'name of the fleck to create');
  program.option('--no-add', 'do not add an entry to `build/flecks.yml`');
  program.action(async (fleck, {add}) => {
    try {
      const flecks = await Flecks.bootstrap();
      const {packageManager} = flecks.get('@flecks/core/server');
      const isMonorepo = await checkIsMonorepo();
      const [scope, pkg] = await target(fleck);
      const name = [scope, pkg].filter((e) => !!e).join('/');
      const destination = join(
        join(...[FLECKS_CORE_ROOT].concat(isMonorepo ? ['packages'] : [])),
        pkg,
      );
      if (!await testDestination(destination)) {
        const error = new Error(
          `@flecks/create-fleck: destination '${destination} already exists: aborting`,
        );
        error.code = 129;
        throw error;
      }
      const fileTree = await move(name, join(__dirname, 'template'), 'fleck', flecks);
      // Write the tree.
      await fileTree.writeTo(destination);
      await build(packageManager, destination);
      if (isMonorepo && add) {
        await Flecks.addFleckToYml(name, pkg);
      }
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.error('Creation failed:', error);
    }
  });
  await program.parseAsync(process.argv);
})();
