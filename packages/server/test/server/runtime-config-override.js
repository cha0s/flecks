import {join} from 'path';

import {heavySetup} from '@flecks/core/build/testing';
import {writeFile} from '@flecks/core/server';
import {expect} from 'chai';

import {build, createApplication, serverActions} from './build/build';

let path;

before(heavySetup(async () => {
  path = await createApplication();
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
}));

it('propagates bootstrap config', async () => {
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
