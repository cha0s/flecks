import {expect} from 'chai';

import {Flecks} from '@flecks/core';

it('can create an empty instance', () => {
  const flecks = new Flecks();
  expect(Object.keys(flecks.config).length)
    .to.equal(0);
  expect(Object.keys(flecks.hooks).length)
    .to.equal(0);
  expect(Object.keys(flecks.flecks).length)
    .to.equal(0);
});
