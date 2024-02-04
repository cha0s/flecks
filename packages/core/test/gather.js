import {expect} from 'chai';

import {Flecks, ById, ByType} from '@flecks/core';

it('can gather', async () => {
  const flecks = await Flecks.from({
    flecks: {
      one: {
        hooks: {
          'one.gather': Flecks.provide(require.context('./gather/one', false)),
          'one.gather.decorate': Flecks.decorate(require.context('./gather/one/decorators', false)),
        },
      },
      two: {
        hooks: {
          'one.gather': Flecks.provide(require.context('./gather/two', false)),
        },
      },
    },
  });
  const Gathered = await flecks.gather('one.gather');
  expect(Object.keys(Gathered[ByType]).length)
    .to.equal(Object.keys(Gathered[ById]).length);
  const typeKeys = Object.keys(Gathered[ByType]);
  for (let i = 0; i < typeKeys.length; ++i) {
    const type = typeKeys[i];
    expect(Gathered[type].foo)
      .to.equal(type);
  }
  expect(typeof Gathered.Three.bar)
    .to.not.be.undefined;
});
