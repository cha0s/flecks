import {join} from 'path';

import {banner} from '@flecks/core/server';

const {
  NODE_ENV,
} = process.env;

let win;

async function createWindow(flecks) {
  const {BrowserWindow} = flecks.get('$flecks/electron');
  const {browserWindowOptions} = flecks.get('@flecks/electron/server');
  win = new BrowserWindow(browserWindowOptions);
  await flecks.invokeSequentialAsync('@flecks/electron/server.window', win);
}

export const hooks = {
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
     * Defaults to `http://${flecks.get('@flecks/web/server.public')}`.
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
          return join('..', 'node_modules', '.bin', 'electron');
        };
      }
    }
  },
  '@flecks/electron/server.initialize': async (electron, flecks) => {
    electron.app.on('window-all-closed', () => {
      const {quitOnClosed} = flecks.get('@flecks/electron/server');
      if (!quitOnClosed) {
        return;
      }
      // Apple has to be *special*.
      if (process.platform === 'darwin') {
        return;
      }
      electron.app.quit();
    });
    electron.app.on('activate', async () => {
      if (electron.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
    await electron.app.whenReady();
    await createWindow(flecks);
  },
  '@flecks/electron/server.window': async (win, flecks) => {
    const {public: $$public} = flecks.get('@flecks/web/server');
    const {
      installExtensions,
      url = `http://${$$public}`,
    } = flecks.get('@flecks/electron/server');
    if (installExtensions && 'production' !== NODE_ENV) {
      const {
        default: installExtension,
        REDUX_DEVTOOLS,
        REACT_DEVELOPER_TOOLS,
      } = __non_webpack_require__('electron-devtools-installer');
      let extensions = installExtensions;
      if (!Array.isArray(extensions)) {
        extensions = [];
        if (flecks.fleck('@flecks/react')) {
          extensions.push(REACT_DEVELOPER_TOOLS);
        }
        if (flecks.fleck('@flecks/redux')) {
          extensions.push(REDUX_DEVTOOLS);
        }
      }
      await installExtension(extensions);
    }
    await win.loadURL(url);
  },
  '@flecks/repl.context': (flecks) => ({
    electron: {
      createWindow: () => createWindow(flecks),
    },
  }),
  '@flecks/server.up': async (flecks) => {
    // Local require because electron is kinda skittish.
    // eslint-disable-next-line global-require
    const electron = require('electron');
    // `electron.app` will be undefined if we aren't running in an electron environment. Just bail.
    if (!electron.app) {
      return;
    }
    flecks.set('$flecks/electron', electron);
    await flecks.invokeSequentialAsync('@flecks/electron/server.initialize', electron);
  },
};
