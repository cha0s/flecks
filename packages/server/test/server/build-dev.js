import {access} from 'fs/promises';
import {join} from 'path';

import {expect} from 'chai';

import {createApplication, build} from './build/build';

it('builds for development', async () => {
  const path = await createApplication();
  await build(path, {args: ['-d']});
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
