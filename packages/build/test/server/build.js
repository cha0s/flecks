import {join} from 'path';

import {expect} from 'chai';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const Build = __non_webpack_require__(join(FLECKS_CORE_ROOT, 'build', 'build'));
const loadConfig = __non_webpack_require__(join(FLECKS_CORE_ROOT, 'build', 'load-config'));

const buildRoot = join(FLECKS_CORE_ROOT, 'test', 'server', 'build', 'root');

it('defaults config', async () => {
  expect(await loadConfig(FLECKS_CORE_ROOT))
    .to.deep.equal([
      'barebones',
      {
        [`@flecks/build:${FLECKS_CORE_ROOT}`]: {},
        '@flecks/core': {},
        '@flecks/fleck': {},
      },
    ]);
});

it('loads config', async () => {
  expect(await loadConfig(buildRoot))
    .to.deep.equal(['YML', {one: {}, 'two:./two': {}}]);
});

it('configures from environment', async () => {
  const {env} = process;
  env.FLECKS_ENV__one__foo = '{"boo": 2}';
  env.FLECKS_ENV__two__bar = 'yo';
  expect(
    Build.environmentConfiguration({
      one: {foo: {boo: 1}},
      two: {bar: 'hi'},
    }),
  )
    .to.deep.equal({
      one: {foo: {boo: 2}},
      two: {bar: 'yo'},
    });
});

it('dealiases config', async () => {
  expect(await Build.dealiasedConfig({'two:./two': {foo: 2}}))
    .to.deep.equal({
      two: {
        foo: 2,
      },
    });
});
