export const hooks = {

  /**
   * Configure the session. See: https://github.com/expressjs/session#sessionoptions
   * @invoke MergeAsync
   */
  '@flecks/session.config': async () => ({
    saveUninitialized: true,
  }),

};
