// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
import {Flecks} from '@flecks/core';

export const testNodespace = () => [
  /* eslint-disable no-eval */
  eval('typeof require.context'),
  eval('typeof __non_webpack_require__'),
  /* eslint-enable no-eval */
];

export const hooks = {
  '@flecks/core.config': () => ({
    foo: 'bar',
  }),
  '@flecks/core/one/test-gather': (
    Flecks.provide(require.context('./things', false, /\.js$/))
  ),
  '@flecks/core/one/test-gather.decorate': (
    Flecks.decorate(require.context('./things/decorators', false, /\.js$/))
  ),
  '@flecks/core/test/invoke': () => 69,
  '@flecks/core/test/invoke-parallel': (O) => {
    O.foo *= 2;
  },
  '@flecks/core/test/invoke-merge': () => ({foo: 69}),
  '@flecks/core/test/invoke-merge-async': () => new Promise((resolve) => { resolve({foo: 69}); }),
  '@flecks/core/test/invoke-merge-unique': () => ({foo: 69}),
  '@flecks/core/test/invoke-merge-unique-async': () => new Promise((resolve) => { resolve({foo: 69}); }),
  '@flecks/core/test.middleware': () => (foo, next) => {
    foo.bar += 1;
    next();
  },
};
