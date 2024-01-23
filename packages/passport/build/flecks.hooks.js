export const hooks = {

  /**
   * Define passport login strategies. See: https://www.passportjs.org/concepts/authentication/strategies/
   * @param {Passport} passport The passport instance.
   */
  '@flecks/passport.strategies': (passport) => ({
    MyService: SomeStrategy,
  }),

};
