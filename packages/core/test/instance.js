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
  flecks = Flecks.from({
    flecks: {'@flecks/core/one': testOne},
  });
  expect(flecks.get(['@flecks/core/one']))
    .to.contain({foo: 'bar'});
  flecks = Flecks.from({
    config: {'@flecks/core/one': {foo: 'baz'}},
    flecks: {'@flecks/core/one': testOne},
  });
  expect(flecks.get(['@flecks/core/one']))
    .to.contain({foo: 'baz'});
});
