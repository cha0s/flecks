import Flecks, {Hooks} from '../../src/flecks';

export default {
  [Hooks]: {
    './fleck-one/test-gather': (
      Flecks.provide(require.context('./things', false, /\.js$/))
    ),
    'flecks-test-invoke': () => 420,
    'flecks-test-invoke-parallel': (O) => new Promise((resolve) => {
      setTimeout(() => {
        // eslint-disable-next-line no-param-reassign
        O.foo += 2;
        resolve();
      }, 0);
    }),
    'flecks-test-invoke-reduce': () => ({bar: 420}),
    'flecks-test-invoke-reduce-async': () => new Promise((resolve) => resolve({bar: 420})),
  },
};
