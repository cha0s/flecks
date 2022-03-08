import {Hooks} from '@flecks/core';

export default {
  [Hooks]: {
    /**
     * Modify express-session configuration.
     *
     * See: https://www.npmjs.com/package/express-session
     */
    '@flecks/user.session': () => ({
      saveUninitialized: true,
    }),
  },
};

