import {expect} from 'chai';

import {Flecks, ById, ByType} from '@flecks/core';

const testOne = require('./packages/one');
const testTwo = require('./packages/two');

it('can gather', () => {
  const flecks = Flecks.from({
    flecks: {
      '@flecks/core/one': testOne,
      '@flecks/core/two': testTwo,
    },
  });
  const Gathered = flecks.gather('@flecks/core/one/test-gather');
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
