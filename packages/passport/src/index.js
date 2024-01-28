import {Flecks} from '@flecks/core';

import {user, users} from './state';

export * from './state';

export const hooks = {
  '@flecks/core.config': () => ({
    /**
     * Path to redirect to after failed login.
     */
    failureRedirect: '/',
    /**
     * Path to redirect to after logout.
     */
    logoutRedirect: '/',
    /**
     * Path to redirect to after successful login.
     */
    successRedirect: '/',
  }),
  '@flecks/redux.slices': () => ({user, users}),
  '@flecks/socket.packets': Flecks.provide(require.context('./packets')),
};
