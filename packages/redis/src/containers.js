export default (flecks) => ({
  redis: {
    environment: {
      app: {
        host: 'redis',
      },
    },
    image: 'redis:6',
    mount: '/data',
    ports: {[flecks.get('@flecks/redis/server.port')]: 6379},
  },
});
