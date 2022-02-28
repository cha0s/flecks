export default (flecks) => ({
  redis: {
    image: 'redis',
    mount: '/data',
    ports: {[flecks.get('@flecks/redis/server.port')]: 6379},
  },
});
