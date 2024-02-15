/* eslint-disable camelcase */

import {join} from 'path';

import {expect} from 'chai';

import resolve from '@flecks/core/build/resolve';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const root = join(FLECKS_CORE_ROOT, 'test', 'resolve');

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
});

it('can resolve exact', async () => {
  const clear = resolve({
    alias: {
      './foo$': './bar',
    },
    fallback: {},
  }, []);
  expect(__non_webpack_require__(join(root, 'boo')))
    .to.equal(2);
  clear();
});

it('can resolve false', async () => {
  const clear = resolve({
    alias: {
      './foo': false,
    },
    fallback: {},
  }, []);
  expect(__non_webpack_require__(join(root, 'moo')))
    .to.be.undefined;
  clear();
});
