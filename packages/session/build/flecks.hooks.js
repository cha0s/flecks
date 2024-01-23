export const hooks = {

  /**
   * Configure the session. See: https://github.com/expressjs/session#sessionoptions
   */
  '@flecks/session.config': async () => ({
    saveUninitialized: true,
  }),

  /**
   * Define sequential actions to run when the server comes up.
   */
  '@flecks/server.up': async () => {
    await youCanDoAsyncThingsHere();
  },

};
