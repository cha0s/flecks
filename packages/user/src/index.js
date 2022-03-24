import {Hooks} from '@flecks/core';

import {Logout} from './packets';

import {user, users} from './state';

export * from './state';

export default {
  [Hooks]: {
    '@flecks/redux.slices': () => ({
      user,
      users,
    }),
    '@flecks/socket.packets': (flecks) => ({
      Logout: Logout(flecks),
    }),
  },
};
