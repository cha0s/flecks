import {Flecks} from '@flecks/core';

export const hooks = {
  '@flecks/core/one/test-gather': (
    Flecks.provide(require.context('./things', false, /\.js$/))
  ),
  '@flecks/core/test/invoke': () => 420,
  '@flecks/core/test/invoke-parallel': (O) => new Promise((resolve) => {
    setTimeout(() => {
      O.foo += 2;
      resolve();
    }, 0);
  }),
  '@flecks/core/test/invoke-merge': () => ({bar: 420}),
  '@flecks/core/test/invoke-merge-async': () => new Promise((resolve) => { resolve({bar: 420}); }),
  '@flecks/core/test/invoke-merge-unique': () => ({foo: 69}),
  '@flecks/core/test/invoke-merge-unique-async': () => new Promise((resolve) => { resolve({foo: 69}); }),
  '@flecks/core/test.middleware': () => (foo, next) => {
    foo.bar *= 2;
    next();
  },
};
