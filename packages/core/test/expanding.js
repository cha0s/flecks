import {expect} from 'chai';

import {Flecks} from '@flecks/core/build/flecks';

it('includes all by default', async () => {
  const flecks = await Flecks.from({
    config: {
      one: {test: ['one', 'two']},
    },
    flecks: {
      one: {hooks: {'one.test': () => {}}},
      two: {hooks: {'one.test': () => {}}},
    },
  });
  expect(flecks.expandedFlecks('one.test'))
    .to.deep.equal(['one', 'two']);
});

it('respects elision', async () => {
  const flecks = await Flecks.from({
    config: {
      one: {test: ['two', '...', 'three']},
    },
    flecks: {
      one: {hooks: {'one.test': () => {}}},
      two: {hooks: {'one.test': () => {}}},
      three: {hooks: {'one.test': () => {}}},
      four: {hooks: {'one.test': () => {}}},
    },
  });
  const expanded = flecks.expandedFlecks('one.test');
  expect(expanded.shift())
    .to.equal('two');
  expect(expanded.pop())
    .to.equal('three');
});

it('detects yet allows suspicious hook ordering', async () => {
  const flecks = await Flecks.from({
    config: {
      one: {test: ['one', 'two']},
    },
    flecks: {
      one: {hooks: {'one.test': () => {}}},
      two: {hooks: {'one.test': Flecks.priority(() => {}, {before: 'one'})}},
    },
  });
  let suspected = false;
  Flecks.debug = (message) => {
    suspected = message.includes('Suspicious ordering specification');
  };
  expect(flecks.expandedFlecks('one.test'))
    .to.deep.equal(['one', 'two']);
  expect(suspected)
    .to.be.true;
});

it('throws on cyclic dependency', async () => {
  const flecks = await Flecks.from({
    flecks: {
      one: {hooks: {'one.test': Flecks.priority(() => {}, {before: 'two'})}},
      two: {hooks: {'one.test': Flecks.priority(() => {}, {before: 'one'})}},
    },
  });
  expect(() => flecks.expandedFlecks('one.test'))
    .to.throw(/Illegal ordering specification/);
});
