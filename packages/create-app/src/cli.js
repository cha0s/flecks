import {join, normalize} from 'path';

import {Flecks} from '@flecks/core/server';
import validate from 'validate-npm-package-name';

import build from './build';
import move from './move';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const cwd = normalize(FLECKS_CORE_ROOT);

const create = async (flecks) => {
  const name = process.argv[2];
  const {errors} = validate(name);
  if (errors) {
    throw new Error(`@flecks/create-app: invalid app name: ${errors.join(', ')}`);
  }
  const destination = join(cwd, name);
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
