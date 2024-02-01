import {Flecks} from '@flecks/core';

import createClient from './create-client';

export {default as redis} from 'redis';

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

export const hooks = {
  '@flecks/repl.context': async (flecks) => ({
    redisClient: await createClient(flecks),
  }),
  '@flecks/server.up': Flecks.priority(
    async (flecks) => {
      const client = await createClient(flecks);
      await client.disconnect();
    },
    {after: '@flecks/docker/server'},
  ),
};
