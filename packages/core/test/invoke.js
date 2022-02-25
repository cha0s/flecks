import {expect} from 'chai';

import Flecks from '../src/flecks';

const testFleckOne = require('./fleck-one');
const testFleckTwo = require('./fleck-two');

let flecks;

beforeEach(() => {
  flecks = new Flecks({
    flecks: {
      './fleck-one': testFleckOne,
      './fleck-two': testFleckTwo,
    },
  });
});

it('can invoke', () => {
  expect(flecks.invoke('flecks-test-invoke'))
    .to.deep.equal({
      './fleck-one': 69,
      './fleck-two': 420,
    });
});

it('can invoke parallel', async () => {
  const O = {foo: 3};
  await Promise.all(flecks.invokeParallel('flecks-test-invoke-parallel', O));
  expect(O.foo)
    .to.equal(8);
});

it('can invoke reduced', () => {
  expect(flecks.invokeReduce('flecks-test-invoke-reduce'))
    .to.deep.equal({foo: 69, bar: 420});
});

it('can invoke reduced async', async () => {
  expect(await flecks.invokeReduce('flecks-test-invoke-reduce'))
    .to.deep.equal({foo: 69, bar: 420});
});
