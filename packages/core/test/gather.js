import {expect} from 'chai';

import Flecks, {ById, ByType} from '../src/flecks';

const testFleckOne = require('./fleck-one');
const testFleckTwo = require('./fleck-two');

it('can gather', () => {
  const flecks = new Flecks({
    flecks: {
      './fleck-one': testFleckOne,
      './fleck-two': testFleckTwo,
    },
  });
  const Gathered = flecks.gather('./fleck-one/test-gather');
  expect(Object.keys(Gathered[ByType]).length)
    .to.equal(Object.keys(Gathered[ById]).length);
  const typeKeys = Object.keys(Gathered[ByType]);
  for (let i = 0; i < typeKeys.length; ++i) {
    const type = typeKeys[i];
    expect(Gathered[type].foo)
      .to.equal(type);
  }
  expect(typeof Gathered.Three.bar)
    .to.not.equal('undefined');
});
