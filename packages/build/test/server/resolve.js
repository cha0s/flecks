import {join} from 'path';

import {expect} from 'chai';

import Resolver from '@flecks/build/build/resolver';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

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
