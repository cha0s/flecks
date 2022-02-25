import Flecks, {Hooks} from '../../src/flecks';

export default {
  [Hooks]: {
    '@flecks/core/config': () => ({
      foo: 'bar',
      'test-gather.decorate': ['...'],
    }),
    './fleck-one/test-gather': (
      Flecks.provide(require.context('./things', false, /\.js$/))
    ),
    './fleck-one/test-gather.decorate': (
      Flecks.decorate(require.context('./things/decorators', false, /\.js$/))
    ),
    'flecks-test-invoke': () => 69,
    'flecks-test-invoke-parallel': (O) => {
      // eslint-disable-next-line no-param-reassign
      O.foo *= 2;
    },
    'flecks-test-invoke-reduce': () => ({foo: 69}),
    'flecks-test-invoke-reduce-async': () => new Promise((resolve) => resolve({foo: 69})),
  },
};
