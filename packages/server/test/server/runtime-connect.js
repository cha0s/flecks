import {expect} from 'chai';

import {build, createApplicationAt, serverActions} from './build/build';

it('connects', async () => {
  const path = await createApplicationAt('runtime-connect');
  await build(path, {args: ['-d']});
  const {code} = await serverActions(path, [
    {type: 'exit', payload: 42},
  ]);
  expect(code)
    .to.equal(42);
});
