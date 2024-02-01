module.exports = (flecks) => ({
  redis: {
    environment: {
      app: {
        host: 'redis',
      },
    },
    extra: {
      command: `--port ${flecks.get('@flecks/redis.port')}`,
    },
    image: 'redis:6',
    mount: '/data',
    ports: {[flecks.get('@flecks/redis.port')]: 6379},
  },
});
