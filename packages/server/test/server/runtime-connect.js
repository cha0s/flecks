import {expect} from 'chai';

import {build, createApplication, serverActions} from './build/build';

it('connects', async () => {
  const path = await createApplication();
  await build(path, {args: ['-d']});
  const {code} = await serverActions(path, [
    {type: 'exit', payload: 42},
  ]);
  expect(code)
    .to.equal(42);
});
