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
    const client = createClient(flecks, {legacyMode: true});
    await client.connect();
    return {
      store: new RedisStore({client}),
    };
  },
  '@flecks/socket.server': async (flecks) => {
    const pubClient = createClient(flecks);
    const subClient = createClient(flecks);
    await Promise.all([pubClient.connect(), subClient.connect()]);
    debugSilly('creating adapter');
    return {
      adapter: redisAdapter(pubClient, subClient),
    };
  },
};
