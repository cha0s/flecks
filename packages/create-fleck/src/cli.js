import {readFile, stat, writeFile} from 'fs/promises';
import {join, normalize} from 'path';

import {build, move, validate} from '@flecks/create-app/server';
import {dumpYml, Flecks, loadYml} from '@flecks/core/server';
import {confirm} from '@inquirer/prompts';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const cwd = normalize(FLECKS_CORE_ROOT);

const checkIsMonorepo = async (cwd) => {
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
    if (await checkIsMonorepo(cwd)) {
      scope = await monorepoScope(cwd);
    }
    return [scope, pkg];
  }
  return parts;
};

const create = async (flecks) => {
  const isMonorepo = await checkIsMonorepo(cwd);
  const [scope, pkg] = await target(process.argv[2]);
  const path = scope && isMonorepo ? join(cwd, 'packages') : cwd;
  const name = [scope, pkg].filter((e) => !!e).join('/');
  const destination = join(path, pkg);
  await move(name, join(__dirname, 'template'), destination, 'fleck', flecks);
  await build(destination);
  if (isMonorepo && await confirm({message: 'Add fleck to `build/flecks.yml`?'})) {
    const key = `${name}:${join('.', 'packages', pkg)}`;
    const ymlPath = join(FLECKS_CORE_ROOT, 'build', 'flecks.yml');
    let yml = loadYml(await readFile(ymlPath));
    yml = Object.fromEntries(Object.entries(yml).concat([[key, {}]]));
    await writeFile(ymlPath, dumpYml(yml, {forceQuotes: true, sortKeys: true}));
  }
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
