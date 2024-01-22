const FlecksDockerOutput = require('./plugin');

exports.hooks = {
  '@flecks/build.config': (target, config, env, argv, flecks) => {
    if ('server' !== target) {
      return;
    }
    config.plugins.push(new FlecksDockerOutput({flecks}));
  },
  '@flecks/core.config': () => ({
    /**
     * Whether to run docker containers.
     */
    enabled: true,
  }),
};
