export const hooks = {
  /**
   * Define sequential actions to run when the server comes up.
   */
  '@flecks/server.up': async () => {
    await youCanDoAsyncThingsHere();
  },
};
