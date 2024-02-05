import {expect} from 'chai';

import {build, createApplicationAt, serverActions} from './build/build';

it('propagates runtime config', async () => {
  const path = await createApplicationAt('runtime-config-runtime');
  await build(path, {args: ['-d']});
  const {results: [{payload: foo}]} = await serverActions(path, [
    {type: 'config.get', payload: 'comm.foo'},
    {type: 'exit'},
  ]);
  expect(foo)
    .to.equal('bar');
});
