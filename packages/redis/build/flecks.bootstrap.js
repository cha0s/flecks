const containers = require('./containers');

exports.hooks = {
  '@flecks/core.config': () => ({
    /**
     * Redis server host.
     */
    host: 'localhost',
    /**
     * Redis server port.
     */
    port: 6379,
  }),
  '@flecks/docker.containers': containers,
};
