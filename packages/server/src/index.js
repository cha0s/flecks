import {Hooks} from '@flecks/core';

export default {
  [Hooks]: {
    '@flecks/core.config': () => ({
      /**
       * Whether HMR is enabled.
       */
      hot: false,
      /**
       * Whether the Node inspector is enabled.
       */
      inspect: false,
      /**
       * Whether node profiling is enabled.
       */
      profile: false,
      /**
       * Whether to start the server after building.
       */
      start: false,
    }),
  },
};
