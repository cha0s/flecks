import {writeFile} from 'fs/promises';
import {join} from 'path';

import {heavySetup} from '@flecks/core/build/testing';
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
  expect((await socket.send({type: 'config.get', payload: 'comm.foo'})).payload)
    .to.equal('bar');
  await writeFile(
    join(path, 'build', 'flecks.yml'),
    `
      '@flecks/build': {}
      '@flecks/core': {}
      '@flecks/server': {}
      'comm:./comm': {foo: 'baz'}
    `,
  );
  await socket.waitForHmr();
  expect((await socket.send({type: 'config.get', payload: 'comm.foo'})).payload)
    .to.equal('baz');
  let restarted;
  const whatHappened = Promise.race([
    socket.waitForHmr()
      .then(() => {
        restarted = false;
      })
      .catch(() => {}),
    new Promise((resolve) => {
      socket.socket.on('close', () => {
        restarted = true;
        resolve();
      });
    }),
  ]);
  await writeFile(
    join(path, 'build', 'flecks.yml'),
    `
      '@flecks/build': {}
      '@flecks/core': {}
      '@flecks/server': {}
      'comm:./comm': {foo: 'fail'}
    `,
  );
  await whatHappened;
  expect(restarted)
    .to.be.true;
});
