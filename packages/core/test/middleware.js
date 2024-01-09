import {expect} from 'chai';

import {Flecks} from '@flecks/core';

const testOne = require('./one');
const testTwo = require('./two');

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
      // Intentionally default to the wrong order...
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
      // Intentionally default to the wrong order...
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
