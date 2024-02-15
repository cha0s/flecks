import {join} from 'path';

import {writeFile} from '@flecks/core/server';
import {expect} from 'chai';

import {withServer} from './helpers/with-server';

it('restarts when config keys change', withServer(async ({server, socket}) => {
  let restarted;
  const whatHappened = Promise.race([
    socket.waitForAction('hmr')
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
    join(server.path, 'build', 'flecks.yml'),
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
  await server.socketServer.waitForSocket({task: this})
    .then(async (socket) => {
      ({payload: config} = await socket.send({type: 'config.get', payload: '@flecks/repl/server'}));
    });
  expect(config)
    .to.not.be.undefined;
}));
