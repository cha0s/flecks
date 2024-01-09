import {Flecks} from '@flecks/core';

export const hooks = {
  '@flecks/core/test.middleware': Flecks.before(['@flecks/core/two'], Flecks.after(
    ['@flecks/core/one'],
    () => () => {},
  )),
};
