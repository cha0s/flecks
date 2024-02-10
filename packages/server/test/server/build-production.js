import {access} from 'fs/promises';
import {join} from 'path';

import {heavySetup} from '@flecks/core/build/testing';
import {expect} from 'chai';

import {createApplication, build} from './build/build';

let artifact;

before(heavySetup(async () => {
  const path = await createApplication();
  await build(path);
  try {
    await access(join(path, 'dist', 'server', 'index.js'));
    artifact = true;
  }
  catch (error) {
    // intermittent failure...
    console.error(error); // eslint-disable-line no-console
    artifact = false;
  }
}));

it('builds for production', async () => {
  expect(artifact)
    .to.be.true;
});
