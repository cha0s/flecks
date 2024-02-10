import {heavySetup} from '@flecks/core/build/testing';
import {expect} from 'chai';

import {build, createApplication, serverActions} from './build/build';

let path;

before(heavySetup(async () => {
  path = await createApplication();
  await build(path, {args: ['-d']});
}));

it('connects', async () => {
  const {code} = await serverActions(path, [
    {type: 'exit', payload: 42},
  ]);
  expect(code)
    .to.equal(42);
});
