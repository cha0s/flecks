import {mkdir} from 'fs/promises';
import {join} from 'path';

import {heavySetup} from '@flecks/core/build/testing';
import {writeFile} from '@flecks/core/server';
import {expect} from 'chai';

import {build, createApplication, serverActions} from './build/build';

let path;

before(heavySetup(async () => {
  path = await createApplication();
  await mkdir(join(path, 'server-only', 'build'), {recursive: true});
  await writeFile(join(path, 'server-only', 'package.json'), '{}');
  const config = `
  exports.hooks = {
    '@flecks/core.config': () => ({
      foo: 'bar',
      blah: {one: 2, three: 4},
    }),
  };
  `;
  await writeFile(join(path, 'server-only', 'build', 'flecks.bootstrap.js'), config);
  await writeFile(
    join(path, 'build', 'flecks.yml'),
    `
      '@flecks/build': {}
      '@flecks/core': {}
      '@flecks/server': {}
      'comm:./comm': {}
      'server-only:./server-only': {foo: 'baz'}
    `,
  );
  await build(path, {args: ['-d']});
}));

it('propagates bootstrap config', async () => {
  const {results: [{payload: foo}, {payload: blah}]} = await serverActions(path, [
    {type: 'config.get', payload: 'server-only.foo'},
    {type: 'config.get', payload: 'server-only.blah'},
    {type: 'exit'},
  ]);
  expect(foo)
    .to.equal('baz');
  expect(blah)
    .to.deep.equal({one: 2, three: 4});
});
