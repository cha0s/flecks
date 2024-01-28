import {expect} from 'chai';

import {Flecks} from '@flecks/core';

const testOne = require('./packages/one');
const testTwo = require('./packages/two');
const testThree = require('./packages/three');

it('can make middleware', async () => {
  const flecks = await Flecks.from({
    config: {
      '@flecks/core/test': {
        middleware: [
          '@flecks/core/one',
          '@flecks/core/two',
        ],
      },
    },
    flecks: {
      '@flecks/core/one': testOne,
      '@flecks/core/two': testTwo,
    },
  });
  const foo = {bar: 1};
  const mw = flecks.makeMiddleware('@flecks/core/test.middleware');
  await new Promise((resolve) => {
    mw(foo, () => {
      expect(foo.bar).to.equal(4);
      resolve();
    });
  });
});

it('respects explicit middleware configuration', async () => {
  const flecks = await Flecks.from({
    config: {
      '@flecks/core/test': {
        middleware: [
          '@flecks/core/two',
          '@flecks/core/one',
        ],
      },
    },
    flecks: {
      '@flecks/core/one': testOne,
      '@flecks/core/two': testTwo,
    },
  });
  const foo = {bar: 1};
  const mw = flecks.makeMiddleware('@flecks/core/test.middleware');
  await new Promise((resolve) => {
    mw(foo, () => {
      expect(foo.bar).to.equal(3);
      resolve();
    });
  });
});

it('respects middleware elision', async () => {
  const flecks = await Flecks.from({
    config: {
      '@flecks/core/test': {
        middleware: [
          '...',
        ],
      },
    },
    flecks: {
      '@flecks/core/one': testOne,
      '@flecks/core/two': testTwo,
    },
  });
  const foo = {bar: 1};
  const mw = flecks.makeMiddleware('@flecks/core/test.middleware');
  await new Promise((resolve) => {
    mw(foo, () => {
      expect(foo.bar).to.equal(3);
      resolve();
    });
  });
});

it('throws on elision graph cycle', async () => {
  const flecks = await Flecks.from({
    config: {
      '@flecks/core/test': {
        middleware: [
          '...',
        ],
      },
    },
    flecks: {
      '@flecks/core/one': testOne,
      '@flecks/core/two': testTwo,
      '@flecks/core/three': testThree,
    },
  });
  const tryMaking = () => flecks.makeMiddleware('@flecks/core/test.middleware');
  expect(tryMaking).to.throw();
});
