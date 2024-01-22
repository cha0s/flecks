import {createClient} from 'redis';

export default async (flecks, opts = {}) => {
  const {
    host,
    port,
  } = flecks.get('@flecks/redis/server');
  const client = createClient({
    url: `redis://${host}:${port}`,
    ...opts,
  });
  const promise = new Promise((resolve, reject) => {
    client.on('ready', resolve);
    client.on('error', reject);
  });
  await client.connect();
  await promise;
  return client;
};
