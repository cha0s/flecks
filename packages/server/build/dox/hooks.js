import {Hooks} from '@flecks/core';

export default {
  [Hooks]: {
    /**
     * Define sequential actions to run when the server comes up.
     */
    '@flecks/server.up': async () => {
      await youCanDoAsyncThingsHere();
    },
  },
};
