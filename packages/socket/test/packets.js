import {Flecks} from '@flecks/core';
import {expect} from 'chai';

it('automatically gathers packets', async () => {
  const flecks = await Flecks.from({
    flecks: {
      '@flecks/core': await import('@flecks/core'),
      '@flecks/socket': await import('@flecks/socket'),
      '@test/thing': await import('./thing'),
    },
  });
  expect(flecks.socket.Packets.Foo)
    .to.not.be.undefined;
});
