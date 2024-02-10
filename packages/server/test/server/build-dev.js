import {access} from 'fs/promises';
import {join} from 'path';

import {heavySetup} from '@flecks/core/build/testing';
import {expect} from 'chai';

import {createApplication, build} from './build/build';

let artifact;

before(heavySetup(async () => {
  const path = await createApplication();
  await build(path, {args: ['-d']});
  try {
    await access(join(path, 'dist', 'server', 'index.js'));
    artifact = true;
  }
  catch (error) {
    artifact = false;
  }
}));

it('builds for development', async () => {
  expect(artifact)
    .to.be.true;
});
