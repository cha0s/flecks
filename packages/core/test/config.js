import {expect} from 'chai';

import {Flecks} from '@flecks/core/build/flecks';

it('can interpolate', async () => {
  const flecks = await Flecks.from({
    flecks: {
      one: {hooks: {'@flecks/core.config': () => ({foo: 'bar'})}},
    },
  });
  expect(flecks.interpolate('[one.foo]'))
    .to.equal('bar');
});

it('can override config', async () => {
  const flecks = await Flecks.from({
    config: {one: {foo: 'baz'}},
    flecks: {
      one: {hooks: {'@flecks/core.config': () => ({foo: 'bar'})}},
    },
  });
  expect(flecks.get(['one']))
    .to.deep.equal({foo: 'baz'});
});
