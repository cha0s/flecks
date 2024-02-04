import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

import {Flecks} from '@flecks/core';

chai.use(chaiAsPromised);

const {expect} = chai;

const flecks = await Flecks.from({
  config: {
    one: {
      'invoke-composed': ['one', 'three', 'two', 'four'],
      'invoke-composed-async': ['one', 'three', 'two', 'four'],
      'invoke-sequential': ['one', 'three', 'two', 'four'],
      'invoke-sequential-async': ['one', 'three', 'two', 'four'],
      middleware: ['one', 'three', 'two', 'four'],
    },
  },
  flecks: {
    one: {
      hooks: {
        'one.invoke': () => 1,
        'one.invoke-async': async () => 1,
        'one.invoke-composed': (v) => v + 1,
        'one.invoke-composed-async': async (v) => v + 1,
        'one.invoke-flat': () => 1,
        'one.invoke-merge': () => ({foo: 1}),
        'one.invoke-merge-async': async () => ({foo: 1}),
        'one.invoke-merge-unique': () => ({foo: 1}),
        'one.invoke-merge-unique-async': async () => ({foo: 1}),
        'one.invoke-reduce': () => ({foo: 1}),
        'one.invoke-reduce-async': async () => ({foo: 1}),
        'one.invoke-sequential': () => 1,
        'one.invoke-sequential-async': async () => 1,
        'one.middleware': () => (foo, next) => {
          foo.bar += 1;
          next();
        },
      },
    },
    two: {
      hooks: {
        'one.invoke': () => 2,
        'one.invoke-async': async () => 2,
        'one.invoke-composed': (v) => v * 4,
        'one.invoke-composed-async': async (v) => v * 4,
        'one.invoke-flat': () => 2,
        'one.invoke-merge': () => ({bar: 2}),
        'one.invoke-merge-async': async () => ({bar: 2}),
        'one.invoke-merge-unique': () => ({foo: 1}),
        'one.invoke-merge-unique-async': async () => ({foo: 1}),
        'one.invoke-reduce': () => ({foo: 2}),
        'one.invoke-reduce-async': async () => ({foo: 2}),
        'one.invoke-sequential': () => 2,
        'one.invoke-sequential-async': async () => 2,
        'one.middleware': () => (foo, next) => {
          foo.bar *= 4;
          next();
        },
      },
    },
    three: {
      hooks: {
        'one.invoke-composed': (v) => v - 2,
        'one.invoke-composed-async': async (v) => v - 2,
        'one.invoke-sequential': () => 3,
        'one.invoke-sequential-async': async () => 3,
        'one.middleware': () => (foo, next) => {
          foo.bar -= 2;
          next();
        },
      },
    },
    four: {
      hooks: {
        'one.invoke-composed': (v) => v / 2,
        'one.invoke-composed-async': async (v) => v / 2,
        'one.invoke-sequential': () => 4,
        'one.invoke-sequential-async': async () => 4,
        'one.middleware': () => (foo, next) => {
          foo.bar /= 2;
          next();
        },
      },
    },
  },
});

it('can invoke', () => {
  expect(flecks.invoke('one.invoke'))
    .to.deep.equal({one: 1, two: 2});
});

it('can invoke flat', () => {
  expect(flecks.invokeFlat('one.invoke-flat'))
    .to.deep.equal(Object.values(flecks.invoke('one.invoke')));
});

it('can invoke merge', () => {
  expect(flecks.invokeMerge('one.invoke-merge'))
    .to.deep.equal({foo: 1, bar: 2});
});

it('can invoke merge async', async () => {
  expect(await flecks.invokeMergeAsync('one.invoke-merge-async'))
    .to.deep.equal({foo: 1, bar: 2});
});

it('can enforce uniqueness', () => {
  expect(() => flecks.invokeMergeUnique('one.invoke-merge-unique'))
    .to.throw(ReferenceError);
});

it('can enforce uniqueness async', async () => {
  expect(flecks.invokeMergeUniqueAsync('one.invoke-merge-unique-async'))
    .to.be.rejectedWith(ReferenceError);
});

it('can invoke reduce', () => {
  expect(flecks.invokeReduce('one.invoke-reduce', (r, v) => ({...r, ...v}), {}))
    .to.deep.equal({foo: 2});
});

it('can invoke reduce async', async () => {
  expect(await flecks.invokeReduceAsync('one.invoke-reduce-async', (r, v) => ({...r, ...v}), {}))
    .to.deep.equal({foo: 2});
});

it('can invoke sequential', () => {
  expect(flecks.invokeSequential('one.invoke-sequential'))
    .to.deep.equal([1, 3, 2, 4]);
});

it('can invoke sequential async', async () => {
  expect(await flecks.invokeSequentialAsync('one.invoke-sequential-async'))
    .to.deep.equal([1, 3, 2, 4]);
});

it('can invoke composed', () => {
  expect(flecks.invokeComposed('one.invoke-composed', 10))
    .to.equal(18);
});

it('can invoke composed async', async () => {
  expect(await flecks.invokeComposedAsync('one.invoke-composed-async', 10))
    .to.equal(18);
});

it('can make middleware', async () => {
  const foo = {bar: 10};
  const mw = flecks.makeMiddleware('one.middleware');
  await new Promise((resolve, reject) => {
    mw(foo, (error) => {
      error ? reject(error) : resolve();
    });
  });
  expect(foo.bar).to.equal(18);
});
