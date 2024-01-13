import {Flecks} from '@flecks/core';

import {user, users} from './state';

export * from './state';

export const hooks = {
  '@flecks/redux.slices': () => ({user, users}),
  '@flecks/socket.packets': Flecks.provide(require.context('./packets')),
};
