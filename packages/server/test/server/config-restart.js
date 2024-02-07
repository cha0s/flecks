import {writeFile} from 'fs/promises';
import {join} from 'path';

import {expect} from 'chai';

import {buildChild, createApplication} from './build/build';
import {socketListener} from './build/listen';

it('restarts when config keys change', async () => {
  const path = await createApplication();
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
  const socket = await socketServer.waitForSocket();
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
      '@flecks/repl': {}
      '@flecks/server': {}
      'comm:./comm': {}
    `,
  );
  await whatHappened;
  expect(restarted)
    .to.be.true;
  let config;
  await socketServer.waitForSocket()
    .then(async (socket) => {
      ({payload: config} = await socket.send({type: 'config.get', payload: '@flecks/repl/server'}));
    });
  expect(config)
    .to.not.be.undefined;
});
