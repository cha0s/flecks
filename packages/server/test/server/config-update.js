import {join} from 'path';

import {heavySetup} from '@flecks/core/build/testing';
import {writeFile} from '@flecks/core/server';
import {expect} from 'chai';

import {build, createApplication} from './build/build';
import {socketListener} from './build/listen';

let path;
let socket;

before(heavySetup(async () => {
  path = await createApplication();
  const {socketPath, socketServer} = await socketListener();
  build(
    path,
    {
      args: ['-h'],
      opts: {
        env: {
          FLECKS_ENV__flecks_server__start: true,
          FLECKS_SERVER_TEST_SOCKET: socketPath,
        },
      },
    },
  );
  socket = await socketServer.waitForSocket();
}));

it('updates config', async () => {
  expect((await socket.send({type: 'config.get', payload: '@flecks/core.id'})).payload)
    .to.equal('flecks');
  await writeFile(
    join(path, 'build', 'flecks.yml'),
    `
      '@flecks/build': {}
      '@flecks/core': {id: 'testing'}
      '@flecks/server': {}
      'comm:./comm': {}
    `,
  );
  await socket.waitForHmr();
  expect((await socket.send({type: 'config.get', payload: '@flecks/core.id'})).payload)
    .to.equal('testing');
  await socket.send({type: 'exit'});
});
