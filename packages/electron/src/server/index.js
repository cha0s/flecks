import cluster from 'cluster';
import {join} from 'path';

import {require as R} from '@flecks/core/server';
import {
  app,
  BrowserWindow,
} from 'electron';

const {
  FLECKS_CORE_ROOT = process.cwd(),
  NODE_ENV,
} = process.env;

let win;

async function createWindow(flecks) {
  const {browserWindowOptions} = flecks.get('@flecks/electron/server');
  win = new BrowserWindow(browserWindowOptions);
  await flecks.invokeSequentialAsync('@flecks/electron/server.window', win);
}

export const hooks = {
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
  '@flecks/core.webpack': (target, config) => {
    const StartServerWebpackPlugin = R('start-server-webpack-plugin');
    const plugin = config.plugins.find((plugin) => plugin instanceof StartServerWebpackPlugin);
    // Extremely hackish, c'est la vie.
    if (plugin) {
      /* eslint-disable no-underscore-dangle */
      plugin._startServer = function _startServerHacked(callback) {
        const execArgv = this._getArgs();
        const inspectPort = this._getInspectPort(execArgv);
        const clusterOptions = {
          args: [this._entryPoint],
          exec: join(FLECKS_CORE_ROOT, 'node_modules', '.bin', 'electron'),
          execArgv,
        };
        if (inspectPort) {
          clusterOptions.inspectPort = inspectPort;
        }
        cluster.setupMaster(clusterOptions);
        cluster.on('online', (worker) => {
          callback(worker);
        });
        cluster.fork();
      };
      /* eslint-enable no-underscore-dangle */
    }
  },
  '@flecks/electron/server.initialize': async (app, flecks) => {
    app.on('window-all-closed', () => {
      const {quitOnClosed} = flecks.get('@flecks/electron/server');
      if (!quitOnClosed) {
        return;
      }
      // Apple has to be *special*.
      if (process.platform === 'darwin') {
        return;
      }
      app.quit();
    });
    app.on('activate', async () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
    await app.whenReady();
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
    // `app` will be undefined if we aren't running in an electron environment. Just bail.
    if (!app) {
      return;
    }
    await flecks.invokeSequentialAsync('@flecks/electron/server.initialize', app);
  },
};
