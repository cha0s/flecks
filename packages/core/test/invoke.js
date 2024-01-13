import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import {Flecks} from '@flecks/core';

chai.use(chaiAsPromised);

const {expect} = chai;

const testOne = require('./one');
const testTwo = require('./two');

let flecks;

beforeEach(() => {
  flecks = Flecks.from({
    flecks: {
      '@flecks/core/one': testOne,
      '@flecks/core/two': testTwo,
    },
  });
});

it('can invoke', () => {
  expect(flecks.invoke('@flecks/core/test/invoke'))
    .to.deep.equal({
      '@flecks/core/one': 69,
      '@flecks/core/two': 420,
    });
});

it('can invoke merge', () => {
  expect(flecks.invokeMerge('@flecks/core/test/invoke-merge'))
    .to.deep.equal({foo: 69, bar: 420});
});

it('can invoke merge async', async () => {
  expect(await flecks.invokeMergeAsync('@flecks/core/test/invoke-merge-async'))
    .to.deep.equal({foo: 69, bar: 420});
});

it('can enforce uniqueness', () => {
  expect(() => flecks.invokeMergeUnique('@flecks/core/test/invoke-merge-unique'))
    .to.throw(ReferenceError);
});

it('can enforce uniqueness async', async () => {
  expect(flecks.invokeMergeUniqueAsync('@flecks/core/test/invoke-merge-unique-async'))
    .to.be.rejectedWith(ReferenceError);
});
