import {join} from 'path';

import {writeFile} from '@flecks/core/server';
import {expect} from 'chai';

import {withServer} from './build/build';

it('propagates override config', withServer(
  async ({server}) => {
    const [{payload: id}, {payload: foo}] = await server.actions([
      {type: 'config.get', payload: '@flecks/core.id'},
      {type: 'config.get', payload: 'comm.foo'},
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
          'comm:./comm': {foo: 'baz'}
        `,
      );
    },
  },
));
