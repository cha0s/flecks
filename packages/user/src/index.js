import {Hooks} from '@flecks/core';

import {Logout} from './packets';

import user from './state/user';
import users from './state/users';

export * from './state/user';
export * from './state/users';

export default {
  [Hooks]: {
    '@flecks/redux/slices': () => ({
      user,
      users,
    }),
    '@flecks/socket/packets': (flecks) => ({
      Logout: Logout(flecks),
    }),
  },
};
