import {expect} from 'chai';

// eslint-disable-next-line import/no-unresolved
import {Flecks} from '@flecks/core';

const testOne = require('./one');
const testTwo = require('./two');

let flecks;

beforeEach(() => {
  flecks = new Flecks({
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
