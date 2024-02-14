exports.hook = () => ({
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
});
