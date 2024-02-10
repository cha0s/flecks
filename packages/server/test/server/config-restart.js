import {writeFile} from 'fs/promises';
import {join} from 'path';

import {heavySetup} from '@flecks/core/build/testing';
import {expect} from 'chai';

import {buildChild, createApplication} from './build/build';
import {socketListener} from './build/listen';

let path;
let listener;
let socket;

before(heavySetup(async () => {
  path = await createApplication();
  listener = await socketListener();
  const {socketPath, socketServer} = listener;
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

async function restart() {
  this.timeout(0);
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
  const before = Date.now();
  await listener.socketServer.waitForSocket()
    .then(async (socket) => {
      ({payload: config} = await socket.send({type: 'config.get', payload: '@flecks/repl/server'}));
    });
  // Had to rebuild...
  this.timeout(2000 + (Date.now() - before));
  expect(config)
    .to.not.be.undefined;
}

it('restarts when config keys change', restart);
