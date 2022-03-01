import {stat} from 'fs/promises';
import {join, normalize} from 'path';

import {build, move, validate} from '@flecks/create-app/server';
import {Flecks} from '@flecks/core/server';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const cwd = normalize(FLECKS_CORE_ROOT);

const hasPackages = async (cwd) => {
  try {
    await stat(join(cwd, 'packages'));
    return true;
  }
  catch (error) {
    if ('ENOENT' !== error.code) {
      throw error;
    }
    return false;
  }
};

const monorepoScope = async (cwd) => {
  try {
    const {name} = __non_webpack_require__(join(cwd, 'package.json'));
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

const target = async (name) => {
  const {errors} = validate(name);
  if (errors) {
    throw new Error(`@flecks/create-fleck: invalid fleck name: ${errors.join(', ')}`);
  }
  const parts = name.split('/');
  let pkg;
  let scope;
  if (1 === parts.length) {
    pkg = name;
    if (await hasPackages(cwd)) {
      scope = await monorepoScope(cwd);
    }
    return [scope, pkg];
  }
  return parts;
};

const create = async (flecks) => {
  const [scope, pkg] = await target(process.argv[2]);
  const path = scope && (await hasPackages(cwd)) ? join(cwd, 'packages') : cwd;
  const name = [scope, pkg].filter((e) => !!e).join('/');
  const destination = join(path, pkg);
  await move(name, join(__dirname, 'template'), destination, flecks);
  await build(destination);
};

(async () => {
  const flecks = await Flecks.bootstrap();
  try {
    await create(flecks);
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.error(error.message);
    process.exitCode = 1;
  }
})();
