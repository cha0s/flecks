#!/usr/bin/env node

const {stat} = require('fs/promises');
const {join} = require('path');

const addFleckToYml = require('@flecks/core/build/add-fleck-to-yml');
const {Server, program} = require('@flecks/core/server');
const build = require('@flecks/create-app/build/build');
const move = require('@flecks/create-app/build/move');
const testDestination = require('@flecks/create-app/build/testDestination');
const {validate} = require('@flecks/create-app/server');

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
  program.option('--no-alias', 'do not alias the fleck in `build/flecks.yml`');
  program.action(async (fleck, o) => {
    const {alias, add} = o;
    try {
      const flecks = await Server.from();
      const {packageManager} = flecks.get('@flecks/core');
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
      const fileTree = await move(name, join(__dirname, 'template'));
      // Write the tree.
      await fileTree.writeTo(destination);
      await build(packageManager, destination);
      if (isMonorepo && add) {
        await addFleckToYml(...[name].concat(alias ? pkg : []));
      }
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.error('Creation failed:', error);
    }
  });
  await program.parseAsync(process.argv);
})();
