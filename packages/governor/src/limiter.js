import {createClient} from 'redis';
import {RateLimiterRedis} from 'rate-limiter-flexible';

export default async (flecks, options) => {
  const {
    host,
    port,
  } = flecks.get('@flecks/redis/server');
  const storeClient = createClient({host, port});
  // @todo node-redis@4
  // await storeClient.connect();
  return new RateLimiterRedis({
    ...options,
    storeClient,
  });
};
