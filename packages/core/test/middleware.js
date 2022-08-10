import {expect} from 'chai';

import {Flecks} from '@flecks/core';

const testOne = require('./one');
const testTwo = require('./two');

it('can make middleware', (done) => {
  let flecks;
  let foo;
  let mw;
  flecks = new Flecks({
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
  foo = {bar: 1};
  mw = flecks.makeMiddleware('@flecks/core/test.middleware');
  mw(foo, () => {
    expect(foo.bar).to.equal(4);
    flecks = new Flecks({
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
    foo = {bar: 1};
    mw = flecks.makeMiddleware('@flecks/core/test.middleware');
    mw(foo, () => {
      expect(foo.bar).to.equal(3);
      done();
    });
  });
});
