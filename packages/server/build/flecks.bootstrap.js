const {banner} = require('@flecks/build/src/server');

exports.dependencies = ['@flecks/build'];

exports.hooks = {
  '@flecks/build.config.alter': ({server}, env, argv, flecks) => {
    if (server) {
      const resolver = JSON.stringify({
        alias: server.resolve.alias,
        fallback: server.resolve.fallback,
      });
      const stubs = JSON.stringify(flecks.stubs);
      if ('{"alias":{},"fallback":{}}' !== resolver || '[]' !== stubs) {
        server.plugins.push(
          banner({
            // `require()` magic.
            banner: `require('@flecks/core/build/resolve')(${resolver}, ${stubs})`,
            include: 'index.js',
          }),
        );
      }
    }
  },
  '@flecks/build.files': () => [
    /**
     * Server build configuration. See: https://webpack.js.org/configuration/
     */
    'server.webpack.config.js',
  ],
  '@flecks/build.targets': () => ['server'],
  '@flecks/build.targets.alter': (targets) => {
    // Don't build if there's a fleck target.
    if (targets.has('fleck')) {
      targets.delete('server');
    }
  },
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
      preset: 'minimal',
    },
  }),
};
