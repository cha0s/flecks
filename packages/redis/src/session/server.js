import {D} from '@flecks/core';
import redisAdapter from '@socket.io/redis-adapter';
import ConnectRedis from 'connect-redis';
import session from 'express-session';

import createClient from '../create-client';

const debug = D('@flecks/redis/session');
const debugSilly = debug.extend('silly');

const RedisStore = ConnectRedis(session);

export const hooks = {
  '@flecks/core.priority': (graph, hook) => {
    if ('@flecks/server.up' === hook) {
      graph.addDependency('@flecks/session/server', '@flecks/redis/server');
    }
  },
  '@flecks/session.config': async (flecks) => {
    const client = await createClient(flecks, {legacyMode: true});
    return {
      store: new RedisStore({client}),
    };
  },
  '@flecks/socket.server': async (flecks) => {
    const pubClient = await createClient(flecks);
    const subClient = await createClient(flecks);
    debugSilly('creating adapter');
    return {
      adapter: redisAdapter(pubClient, subClient),
    };
  },
};
