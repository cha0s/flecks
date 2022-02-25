const {
  REDIS_PORT = 6379,
} = process.env;

export default () => ({
  redis: {
    args: [
      '-p', `${REDIS_PORT}:6379`,
    ],
    image: 'redis',
    mount: '/data',
  },
});
