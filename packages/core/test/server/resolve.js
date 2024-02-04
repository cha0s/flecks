/* eslint-disable camelcase */

import {join} from 'path';

import {expect} from 'chai';

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
  delete __non_webpack_require__.cache['/home/cha0s/sync/src/code/flecks/packages/core/test/server/resolve/blah.js'];
  expect(__non_webpack_require__(join(root, 'blah')))
    .to.equal(3);
  delete __non_webpack_require__.cache['/home/cha0s/sync/src/code/flecks/packages/core/test/server/resolve/blah.js'];
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
  delete __non_webpack_require__.cache['/home/cha0s/sync/src/code/flecks/packages/core/test/server/resolve/blah.js'];
  delete __non_webpack_require__.cache['/home/cha0s/sync/src/code/flecks/packages/core/test/server/resolve/boo.js'];
  expect(__non_webpack_require__(join(root, 'boo')))
    .to.equal(1);
  delete __non_webpack_require__.cache['/home/cha0s/sync/src/code/flecks/packages/core/test/server/resolve/boo.js'];
});

it('can resolve false', async () => {
  const clear = resolve({
    alias: {
      './foo': false,
    },
    fallback: {},
  }, []);
  expect(__non_webpack_require__(join(root, 'boo.js')))
    .to.be.undefined;
  clear();
  delete __non_webpack_require__.cache['/home/cha0s/sync/src/code/flecks/packages/core/test/server/resolve/boo.js'];
  expect(__non_webpack_require__(join(root, 'boo.js')))
    .to.equal(1);
});
