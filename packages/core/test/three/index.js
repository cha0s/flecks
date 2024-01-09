import {Flecks} from '@flecks/core';

export const hooks = {
  '@flecks/core/test.middleware': Flecks.priority(
    () => () => {},
    {after: '@flecks/core/one', before: '@flecks/core/two'},
  ),
};
