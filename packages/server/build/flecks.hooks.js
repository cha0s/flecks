export const hooks = {

  /**
   * Pass information to the runtime.
   */
  '@flecks/server.runtime': async () => ({
    something: '...',
  }),

  /**
   * Define sequential actions to run when the server comes up.
   */
  '@flecks/server.up': async () => {
    await youCanDoAsyncThingsHere();
  },

};
