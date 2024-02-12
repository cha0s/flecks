import {join} from 'path';

import {writeFile} from '@flecks/core/server';
import {expect} from 'chai';

import {withServer} from './build/build';

it('restarts when root sources change', withServer(async ({server, socket}) => {
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
  await writeFile(join(server.path, 'comm', 'package.json'), '{}');
  await whatHappened;
  expect(restarted)
    .to.be.true;
}));
