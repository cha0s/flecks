// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
import {Flecks, Hooks} from '@flecks/core';

export const testNodespace = () => [
  /* eslint-disable no-eval */
  eval('typeof require.context'),
  eval('typeof __non_webpack_require__'),
  /* eslint-enable no-eval */
];

export default {
  [Hooks]: {
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
      // eslint-disable-next-line no-param-reassign
      O.foo *= 2;
    },
    '@flecks/core/test/invoke-merge': () => ({foo: 69}),
    '@flecks/core/test/invoke-merge-async': () => new Promise((resolve) => resolve({foo: 69})),
  },
};
