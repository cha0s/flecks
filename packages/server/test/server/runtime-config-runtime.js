import {expect} from 'chai';

import {build, createApplication, serverActions} from './build/build';

it('propagates runtime config', async () => {
  const path = await createApplication();
  await build(path, {args: ['-d']});
  const {results: [{payload: foo}]} = await serverActions(path, [
    {type: 'config.get', payload: 'comm.foo'},
    {type: 'exit'},
  ]);
  expect(foo)
    .to.equal('bar');
});
