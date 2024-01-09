import {expect} from 'chai';

import {Flecks} from '@flecks/core';

const testOne = require('./one');
const testTwo = require('./two');
const testThree = require('./three');

it('can make middleware', (done) => {
  const flecks = new Flecks({
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
  mw(foo, () => {
    expect(foo.bar).to.equal(4);
    done();
  });
});

it('respects explicit middleware configuration', (done) => {
  const flecks = new Flecks({
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
  mw(foo, () => {
    expect(foo.bar).to.equal(3);
    done();
  });
});

it('respects middleware elision', (done) => {
  const flecks = new Flecks({
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
  mw(foo, () => {
    expect(foo.bar).to.equal(3);
    done();
  });
});

it('throws on elision graph cycle', () => {
  const flecks = new Flecks({
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
