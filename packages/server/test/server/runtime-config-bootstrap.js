import {expect} from 'chai';

import {build, createApplicationAt, serverActions} from './build/build';

it('propagates bootstrap config', async () => {
  const path = await createApplicationAt('runtime-config-bootstrap');
  await build(path, {args: ['-d']});
  const {results: [{payload: id}]} = await serverActions(path, [
    {type: 'config.get', payload: '@flecks/core.id'},
    {type: 'exit'},
  ]);
  expect(id)
    .to.equal('flecks');
});
