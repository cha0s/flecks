const {join} = require('path');

const {banner} = require('@flecks/core/server');

exports.hooks = {
  '@flecks/core.build': (target, config) => {
    if ('server' === target) {
      config.plugins.push(
        banner({
          // Bootstrap our `require()` magic.
          banner: "require('module').Module._initPaths();",
          include: 'index.js',
        }),
      );
    }
  },
  '@flecks/core.config': () => ({
    /**
     * Browser window options.
     *
     * See: https://www.electronjs.org/docs/latest/api/browser-window
     */
    browserWindowOptions: {},
    /**
     * Install devtools extensions (by default).
     *
     * If `true`, will install some devtools extensions based on which flecks are enabled.
     *
     * You can pass an array of Chrome store IDs to install a list of custom extensions.
     *
     * Extensions will not be installed if `'production' === process.env.NODE_ENV`
     */
    installExtensions: true,
    /**
     * Quit the app when all windows are closed.
     */
    quitOnClosed: true,
    /**
     * The URL to load in electron by default.
     *
     * Defaults to `http://${flecks.get('@flecks/web.public')}`.
     */
    url: undefined,
  }),
  '@flecks/core.build.alter': (configs) => {
    const {server: config} = configs;
    if (config) {
      const plugin = config.plugins.find(({pluginName}) => pluginName === 'StartServerPlugin');
      // Extremely hackish, c'est la vie.
      if (plugin) {
        const {exec} = plugin.options;
        plugin.options.exec = (compilation) => {
          plugin.options.args = [join(config.output.path, compilation.getPath(exec))];
          return join('..', '..', 'node_modules', '.bin', 'electron');
        };
      }
    }
  },
};
