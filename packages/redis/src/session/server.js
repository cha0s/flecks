import {Hooks} from '@flecks/core';
import redisAdapter from '@socket.io/redis-adapter';
import ConnectRedis from 'connect-redis';
import D from 'debug';
import session from 'express-session';

import createClient from '../create-client';

const debug = D('@flecks/redis/session');

const RedisStore = ConnectRedis(session);

export default {
  [Hooks]: {
    '@flecks/user/session': async () => {
      const client = createClient({legacyMode: true});
      await client.connect();
      return {
        store: new RedisStore({client}),
      };
    },
    '@flecks/socket/server': async () => {
      const pubClient = createClient();
      const subClient = createClient();
      await Promise.all([pubClient.connect(), subClient.connect()]);
      debug('creating adapter');
      return {
        adapter: redisAdapter(pubClient, subClient),
      };
    },
  },
};
