export const hooks = {
  /**
   * Modify express-session configuration.
   *
   * See: https://www.npmjs.com/package/express-session
   */
  '@flecks/user.session': () => ({
    saveUninitialized: true,
  }),
};
