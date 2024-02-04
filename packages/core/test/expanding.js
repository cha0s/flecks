import {expect} from 'chai';

import {Flecks} from '@flecks/core/build/flecks';

it('detects suspicious hook ordering', async () => {
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
  flecks.expandedFlecks('one.test');
  expect(suspected)
    .to.be.true;
});
