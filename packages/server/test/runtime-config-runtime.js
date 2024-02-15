import {expect} from 'chai';

import {withServer} from './helpers/with-server';

it('propagates runtime config', withServer(async ({server}) => {
  const [{payload: foo}] = await server.actions([
    {type: 'config.get', payload: 'comm.foo'},
    {type: 'exit'},
  ]);
  expect(foo)
    .to.equal('bar');
}));
