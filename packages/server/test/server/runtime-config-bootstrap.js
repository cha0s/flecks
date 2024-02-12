import {mkdir} from 'fs/promises';
import {join} from 'path';

import {writeFile} from '@flecks/core/server';
import {expect} from 'chai';

import {withServer} from './build/build';

it('propagates bootstrap config', withServer(
  async ({server}) => {
    const [{payload: foo}, {payload: blah}] = await server.actions([
      {type: 'config.get', payload: 'server-only.foo'},
      {type: 'config.get', payload: 'server-only.blah'},
      {type: 'exit'},
    ]);
    expect(foo)
      .to.equal('baz');
    expect(blah)
      .to.deep.equal({one: 2, three: 4});
  },
  {
    beforeBuild: async ({path}) => {
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
    },
  },
));
