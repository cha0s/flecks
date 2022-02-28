import {Hooks} from '@flecks/core';

export default {
  [Hooks]: {
    '@flecks/core/config': () => ({
      hot: false,
      inspect: false,
      profile: false,
      start: false,
      up: ['...'],
    }),
  },
};
