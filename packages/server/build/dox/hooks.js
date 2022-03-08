import {Hooks} from '@flecks/core';

export default {
  [Hooks]: {
    /**
     * Define neutrino compilation middleware (e.g. @neutrinojs/react).
     */
    '@flecks/server.compiler': () => {
      return require('@neutrinojs/node');
    },
    /**
     * Define sequential actions to run when the server comes up.
     */
    '@flecks/server.up': async () => {
      await youCanDoAsyncThingsHere();
    },
  },
};

