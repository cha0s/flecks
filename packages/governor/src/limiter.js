import {createClient} from '@flecks/redis/server';
import {RateLimiterRedis} from 'rate-limiter-flexible';

export default async (flecks, options) => {
  const storeClient = await createClient(flecks);
  const legacyClient = storeClient.duplicate({legacyMode: true});
  await legacyClient.connect();
  return new RateLimiterRedis({
    ...options,
    // @todo node-redis@4
    storeClient: legacyClient,
  });
};
