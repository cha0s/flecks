import {join} from 'path';

import {writeFile} from '@flecks/core/server';
import {expect} from 'chai';

import {withServer} from './build/build';

it('allows updates to fail', withServer(async ({server, socket}) => {
  expect((await socket.send({type: 'config.get', payload: 'comm.foo'})).payload)
    .to.equal('bar');
  const hmr = socket.waitForAction('hmr');
  await writeFile(
    join(server.path, 'build', 'flecks.yml'),
    `
      '@flecks/build': {}
      '@flecks/core': {}
      '@flecks/server': {}
      'comm:./comm': {foo: 'baz'}
    `,
  );
  await hmr;
  expect((await socket.send({type: 'config.get', payload: 'comm.foo'})).payload)
    .to.equal('baz');
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
      '@flecks/server': {}
      'comm:./comm': {foo: 'fail'}
    `,
  );
  await whatHappened;
  expect(restarted)
    .to.be.true;
}));
