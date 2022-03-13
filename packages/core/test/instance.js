import {expect} from 'chai';

import {Flecks} from '@flecks/core';

const testOne = require('./one');

it('can create an empty instance', () => {
  const flecks = new Flecks();
  expect(Object.keys(flecks.config).length)
    .to.equal(0);
  expect(Object.keys(flecks.hooks).length)
    .to.equal(0);
  expect(Object.keys(flecks.flecks).length)
    .to.equal(0);
});

it('can gather config', () => {
  let flecks;
  flecks = new Flecks({
    flecks: {'@flecks/core/one': testOne},
  });
  expect(flecks.get(['@flecks/core/one']))
    .to.contain({foo: 'bar'});
  flecks = new Flecks({
    config: {'@flecks/core/one': {foo: 'baz'}},
    flecks: {'@flecks/core/one': testOne},
  });
  expect(flecks.get(['@flecks/core/one']))
    .to.contain({foo: 'baz'});
});
