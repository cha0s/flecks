import {Hooks} from '@flecks/core';

import containers from './containers';
import createClient from './create-client';

export {createClient};

const safeKeys = async (client, pattern, caret) => {
  const result = [];
  do {
    // eslint-disable-next-line no-await-in-loop, no-loop-func
    await new Promise((resolve, reject) => {
      client.scan(caret, 'MATCH', pattern, (error, r) => {
        if (error) {
          reject(error);
          return;
        }
        // eslint-disable-next-line no-param-reassign
        caret = parseInt(r[0], 10);
        result.push(...r[1]);
        resolve();
      });
    });
  } while (0 !== caret);
  return result;
};

export const keys = (client, pattern) => safeKeys(client, pattern, 0);

export default {
  [Hooks]: {
    '@flecks/core.config': () => ({
      host: 'localhost',
      port: 6379,
    }),
    '@flecks/docker.containers': containers,
    '@flecks/repl.context': (flecks) => ({
      redisClient: createClient(flecks),
    }),
  },
};
