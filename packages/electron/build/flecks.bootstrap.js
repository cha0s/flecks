const {
  basename,
  dirname,
  extname,
  join,
  relative,
} = require('path');

const {binaryPath} = require('@flecks/core/src/server');

exports.hooks = {
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
     * You can pass an array of Chrome store IDs to install a list of custom extensions.
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
  '@flecks/build.config.alter': async (configs) => {
    const electronPath = await binaryPath('electron', '@flecks/electron');
    const {server} = configs;
    if (server) {
      const plugin = server.plugins.find(({pluginName}) => pluginName === 'StartServerPlugin');
      if (plugin) {
        const relativePath = relative(server.output.path, electronPath);
        const {exec} = plugin.options;
        plugin.options.exec = (compilation) => {
          const assetPath = compilation.getPath(exec);
          const trimmed = join(dirname(assetPath), basename(assetPath, extname(assetPath)));
          plugin.options.args = [
            join(
              server.output.path,
              `${trimmed}.mjs`,
            ),
          ];
          return relativePath;
        };
      }
    }
  },
};
