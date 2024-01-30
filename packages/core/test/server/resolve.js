import {join} from 'path';

import {expect} from 'chai';
import clearModule from 'clear-module';

import resolve from '@flecks/core/build/resolve';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const root = join(FLECKS_CORE_ROOT, 'test', 'server', 'resolve');

it('can resolve inexact', async () => {
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

it('can resolve exact', async () => {
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

it('can resolve false', async () => {
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
