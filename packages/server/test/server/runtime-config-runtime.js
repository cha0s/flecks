import {heavySetup} from '@flecks/core/build/testing';
import {expect} from 'chai';

import {build, createApplication, serverActions} from './build/build';

let path;

before(heavySetup(async () => {
  path = await createApplication();
  await build(path, {args: ['-d']});
}));

it('propagates runtime config', async () => {
  const {results: [{payload: foo}]} = await serverActions(path, [
    {type: 'config.get', payload: 'comm.foo'},
    {type: 'exit'},
  ]);
  expect(foo)
    .to.equal('bar');
});
