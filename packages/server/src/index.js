export const hooks = {
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
};
