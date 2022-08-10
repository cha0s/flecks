import {Logout} from './packets';

import {user, users} from './state';

export * from './state';

export const hooks = {
  '@flecks/redux.slices': () => ({
    user,
    users,
  }),
  '@flecks/socket.packets': (flecks) => ({
    Logout: Logout(flecks),
  }),
};
