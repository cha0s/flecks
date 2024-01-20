exports.hooks = {
  '@flecks/core.build.config': () => [
    /**
     * Server build configuration. See: https://webpack.js.org/configuration/
     */
    'server.webpack.config.js',
  ],
  '@flecks/core.config': () => ({
    /**
     * Whether HMR is enabled.
     */
    hot: false,
    /**
     * Arguments to pass along to node. See: https://nodejs.org/api/cli.html
     */
    nodeArgs: [],
    /**
     * Environment to pass along to node. See: https://nodejs.org/api/cli.html#environment-variables
     */
    nodeEnv: {},
    /**
     * Whether to start the server after building.
     */
    start: true,
    /**
     * Webpack stats configuration.
     */
    stats: {
      colors: true,
      errorDetails: true,
    },
  }),
  '@flecks/core.targets': () => ['server'],
  '@flecks/core.targets.alter': (targets) => {
    // Don't build if there's a fleck target.
    if (targets.has('fleck')) {
      targets.delete('server');
    }
  },
};
