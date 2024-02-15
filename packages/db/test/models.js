import {Flecks} from '@flecks/core';
import {expect} from 'chai';

it('automatically gathers models', async () => {
  const flecks = await Flecks.from({
    flecks: {
      '@flecks/core': await import('@flecks/core'),
      '@flecks/db': await import('@flecks/db'),
      '@flecks/db/server': await import('@flecks/db/server'),
      '@test/thing': await import('./thing'),
    },
  });
  expect(flecks.db.Models.Foo)
    .to.not.be.undefined;
});
