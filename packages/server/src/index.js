import {Hooks} from '@flecks/core';

export default {
  [Hooks]: {
    '@flecks/core/config': () => ({
      up: ['...'],
    }),
  },
};
