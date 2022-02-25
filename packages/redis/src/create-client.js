import {createClient} from 'redis';

const {
  REDIS_HOST = 'localhost',
  REDIS_PORT = 6379,
} = process.env;

export default (opts = {}) => (
  createClient({
    url: `redis://${opts.host || REDIS_HOST}:${opts.port || REDIS_PORT}`,
    ...opts,
  })
);
