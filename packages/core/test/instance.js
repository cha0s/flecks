import {expect} from 'chai';

import Flecks from '../src/flecks';

const testFleckOne = require('./fleck-one');

it('can create an empty instance', () => {
  const flecks = new Flecks();
  expect(Object.keys(flecks.originalConfig).length)
    .to.equal(0);
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
    flecks: {'./fleck-one': testFleckOne},
  });
  expect(flecks.get(['./fleck-one']))
    .to.contain({foo: 'bar'});
  flecks = new Flecks({
    config: {'./fleck-one': {foo: 'baz'}},
    flecks: {'./fleck-one': testFleckOne},
  });
  expect(flecks.get(['./fleck-one']))
    .to.contain({foo: 'baz'});
});
