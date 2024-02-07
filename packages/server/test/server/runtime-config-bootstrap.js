import {mkdir, writeFile} from 'fs/promises';
import {join} from 'path';

import {expect} from 'chai';

import {build, createApplication, serverActions} from './build/build';

it('propagates bootstrap config', async () => {
  const path = await createApplication();
  await mkdir(join(path, 'server-only', 'build'), {recursive: true});
  await writeFile(join(path, 'server-only', 'package.json'), '{}');
  const config = `
  exports.hooks = {
    '@flecks/core.config': () => ({
      foo: 'bar',
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
      'server-only:./server-only': {}
    `,
  );
  await build(path, {args: ['-d']});
  const {results: [{payload: foo}]} = await serverActions(path, [
    {type: 'config.get', payload: 'server-only.foo'},
    {type: 'exit'},
  ]);
  expect(foo)
    .to.equal('bar');
});
