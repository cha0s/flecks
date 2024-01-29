export const hooks = {

  /**
   * Pass information to the runtime.
   * @invoke Async
   */
  '@flecks/server.runtime': async () => ({
    something: '...',
  }),

  /**
   * Define sequential actions to run when the server comes up.
   * @invoke SequentialAsync
   */
  '@flecks/server.up': async () => {
    await youCanDoAsyncThingsHere();
  },

};
