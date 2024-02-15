import {join} from 'path';

import {expect} from 'chai';

import Resolver from '@flecks/build/build/resolver';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

it('can resolve', async () => {
  const resolver = new Resolver();
  expect(await resolver.resolve('./test/resolve'))
    .to.equal(join(FLECKS_CORE_ROOT, 'test', 'resolve.js'));
});

it('can create aliases at runtime', async () => {
  const resolver = new Resolver();
  expect(await resolver.resolve('./test/foobar'))
    .to.be.undefined;
  resolver.addAlias('./test/foobar', './test/resolve');
  expect(await resolver.resolve('./test/foobar'))
    .to.not.be.undefined;
});
