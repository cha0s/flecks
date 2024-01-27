import {join} from 'path';

import {expect} from 'chai';
import clearModule from 'clear-module';

import resolve from '@flecks/build/build/resolve';
import Resolver from '@flecks/build/build/resolver';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const root = join(FLECKS_CORE_ROOT, 'test', 'server', 'resolve');

it('can resolve', async () => {
  const resolver = new Resolver();
  expect(await resolver.resolve('./test/server/resolve'))
    .to.equal(join(FLECKS_CORE_ROOT, 'test', 'server', 'resolve.js'));
});

it('can create aliases at runtime', async () => {
  const resolver = new Resolver();
  expect(await resolver.resolve('./test/server/foobar'))
    .to.be.undefined;
  resolver.addAlias('./test/server/foobar', './test/server/resolve');
  expect(await resolver.resolve('./test/server/foobar'))
    .to.not.be.undefined;
});

it('can resolve inexact at runtime', async () => {
  const clear = resolve({
    alias: {
      './foo': './bar',
    },
    fallback: {},
  }, []);
  expect(__non_webpack_require__(join(root, 'blah')))
    .to.equal(4);
  clear();
  clearModule(join(root, 'blah'));
  expect(__non_webpack_require__(join(root, 'blah')))
    .to.equal(3);
  clearModule(join(root, 'blah'));
});

it('can resolve exact at runtime', async () => {
  const clear = resolve({
    alias: {
      './foo$': './bar',
    },
    fallback: {},
  }, []);
  expect(__non_webpack_require__(join(root, 'blah')))
    .to.equal(3);
  expect(__non_webpack_require__(join(root, 'boo')))
    .to.equal(2);
  clear();
  clearModule(join(root, 'blah'));
  clearModule(join(root, 'boo'));
  expect(__non_webpack_require__(join(root, 'boo')))
    .to.equal(1);
  clearModule(join(root, 'boo'));
});

it('can resolve false at runtime', async () => {
  const clear = resolve({
    alias: {
      './foo': false,
    },
    fallback: {},
  }, []);
  expect(__non_webpack_require__(join(root, 'boo')))
    .to.be.undefined;
  clear();
  clearModule(join(root, 'boo'));
  expect(__non_webpack_require__(join(root, 'boo')))
    .to.equal(1);
});
