import {join} from 'path';

import {writeFile} from '@flecks/core/server';
import {expect} from 'chai';

import {withServer} from './helpers/with-server';

it('propagates override config', withServer(
  async ({server}) => {
    const [{payload: id}, {payload: foo}] = await server.actions([
      {type: 'config.get', payload: '@flecks/core.id'},
      {type: 'config.get', payload: 'server-test.foo'},
      {type: 'exit'},
    ]);
    expect(id)
      .to.equal('testing');
    expect(foo)
      .to.equal('baz');
  },
  {
    beforeBuild: async ({path}) => {
      await writeFile(
        join(path, 'build', 'flecks.yml'),
        `
          '@flecks/build': {}
          '@flecks/core': {id: 'testing'}
          '@flecks/server': {}
          'server-test:./server-test': {foo: 'baz'}
        `,
      );
    },
  },
));
