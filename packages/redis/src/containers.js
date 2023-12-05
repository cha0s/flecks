export default (flecks) => ({
  redis: {
    environment: {
      app: {
        host: 'redis',
      },
    },
    extra: {
      command: `--port ${flecks.get('@flecks/redis/server.port')}`,
    },
    image: 'redis:6',
    mount: '/data',
    ports: {[flecks.get('@flecks/redis/server.port')]: 6379},
  },
});
