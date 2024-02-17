import {expect} from 'chai';

import {Flecks} from '@flecks/core';

it('can gather split hooks', () => {
  const hooks = Flecks.hooks(require.context('./hooks'));
  expect(hooks['@flecks/core.config'])
    .to.not.be.undefined;
  expect(hooks['@flecks/_colocated'])
    .to.be.undefined;
});
