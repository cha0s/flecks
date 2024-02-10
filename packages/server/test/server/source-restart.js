import {join} from 'path';

import {heavySetup} from '@flecks/core/build/testing';
import {writeFile} from '@flecks/core/server';
import {expect} from 'chai';

import {buildChild, createApplication} from './build/build';
import {socketListener} from './build/listen';

let path;
let socket;

before(heavySetup(async () => {
  path = await createApplication();
  const {socketPath, socketServer} = await socketListener();
  await buildChild(
    path,
    {
      args: ['-w'],
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

it('restarts when root sources change', async () => {
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
  await writeFile(join(path, 'comm', 'package.json'), '{}');
  await whatHappened;
  expect(restarted)
    .to.be.true;
});
