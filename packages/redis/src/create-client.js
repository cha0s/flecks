import {createClient} from 'redis';

export default (flecks, opts = {}) => {
  const {
    host,
    port,
  } = flecks.get('@flecks/redis/server');
  return createClient({
    url: `redis://${host}:${port}`,
    ...opts,
  });
};
