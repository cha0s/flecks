import {createClient} from 'redis';
import {RateLimiterRedis} from 'rate-limiter-flexible';

export default async (options) => {
  const storeClient = createClient();
  // @todo node-redis@4
  // await storeClient.connect();
  return new RateLimiterRedis({
    ...options,
    storeClient,
  });
};
