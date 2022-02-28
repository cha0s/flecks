const {
  REDIS_PORT = 6379,
} = process.env;

export default () => ({
  redis: {
    image: 'redis',
    mount: '/data',
    ports: {[REDIS_PORT]: 6379},
  },
});
