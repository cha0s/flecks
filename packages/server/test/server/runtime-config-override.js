import {writeFile} from 'fs/promises';
import {join} from 'path';

import {expect} from 'chai';

import {build, createApplicationAt, serverActions} from './build/build';

it('propagates bootstrap config', async () => {
  const path = await createApplicationAt('runtime-config-override');
  await writeFile(
    join(path, 'build', 'flecks.yml'),
    `
      '@flecks/build': {}
      '@flecks/core': {id: 'testing'}
      '@flecks/server': {}
      'comm:./comm': {foo: 'baz'}
    `,
  );
  await build(path, {args: ['-d']});
  const {results: [{payload: id}, {payload: foo}]} = await serverActions(path, [
    {type: 'config.get', payload: '@flecks/core.id'},
    {type: 'config.get', payload: 'comm.foo'},
    {type: 'exit'},
  ]);
  expect(id)
    .to.equal('testing');
  expect(foo)
    .to.equal('baz');
});
