#!/usr/bin/env node

const {stat} = require('fs/promises');
const {join} = require('path');

const addPathsToYml = require('@flecks/build/build/add-paths-to-yml');
const {program} = require('commander');
const {
  build,
  install,
  transform,
} = require('@flecks/core/server');
const {move, testDestination} = require('@flecks/create-app/build/move');
const {validate} = require('@flecks/create-app/src/server');

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
    const {name} = require(join(FLECKS_CORE_ROOT, 'package.json'));
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
  program.addOption(
    program.createOption('-pm,--package-manager <binary>', 'package manager binary')
      .choices(['npm', 'bun', 'pnpm', 'yarn']),
  );
  program.action(async (fleck, {alias, add, packageManager}) => {
    try {
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
      const fileTree = await move(name, join(__dirname, '..', 'template'));
      if (isMonorepo) {
        const {version} = require(join(FLECKS_CORE_ROOT, 'package.json'));
        // Inherit version from monorepo root.
        fileTree.pipe(
          'package.json',
          transform((chunk, encoding, done, stream) => {
            stream.push(JSON.stringify({...JSON.parse(chunk), version}));
            done();
          }),
        );
      }
      // Write the tree.
      await fileTree.writeTo(destination);
      // Install and build.
      await install({cwd: destination, packageManager});
      await build({cwd: destination, packageManager});
      if (isMonorepo && add) {
        await addPathsToYml([[name].concat(alias ? `./packages/${pkg}` : []).join(':')]);
      }
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.error('Creation failed:', error);
    }
  });
  await program.parseAsync(process.argv);
})();
