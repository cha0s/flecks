import {expect} from 'chai';

// eslint-disable-next-line import/no-unresolved
import {Flecks} from '@flecks/core/server';

it('can bootstrap', () => {
  const flecks = Flecks.bootstrap({root: './test'});
  expect(flecks.fleck('@flecks/core')).to.not.equal(undefined);
  expect(flecks.fleck('@flecks/core/server')).to.not.equal(undefined);
  expect(flecks.fleck('@flecks/core/one')).to.not.equal(undefined);
  expect(flecks.fleck('@flecks/core/two')).to.not.equal(undefined);
});
