import {access} from 'fs/promises';
import {join} from 'path';

import {expect} from 'chai';

import {createApplicationAt, build} from './build/build';

it('builds for production', async () => {
  const path = await createApplicationAt('production');
  await build(path);
  let artifact;
  try {
    await access(join(path, 'dist', 'server', 'index.js'));
    artifact = true;
  }
  catch (error) {
    artifact = false;
  }
  expect(artifact)
    .to.be.true;
});
