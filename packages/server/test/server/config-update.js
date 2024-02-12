import {join} from 'path';

import {writeFile} from '@flecks/core/server';
import {expect} from 'chai';

import {withServer} from './build/build';

it('updates config', withServer(async ({server, socket}) => {
  expect((await socket.send({type: 'config.get', payload: '@flecks/core.id'})).payload)
    .to.equal('flecks');
  await writeFile(
    join(server.path, 'build', 'flecks.yml'),
    `
      '@flecks/build': {}
      '@flecks/core': {id: 'testing'}
      '@flecks/server': {}
      'comm:./comm': {}
    `,
  );
  await socket.waitForAction('hmr');
  expect((await socket.send({type: 'config.get', payload: '@flecks/core.id'})).payload)
    .to.equal('testing');
  await socket.send({type: 'exit'});
}));
