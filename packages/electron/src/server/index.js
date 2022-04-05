import cluster from 'cluster';
import {join} from 'path';

import {Hooks} from '@flecks/core';
import {require as R} from '@flecks/core/server';
import {
  app,
  BrowserWindow,
} from 'electron';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

let win;

async function createWindow(flecks) {
  const {
    browserWindowOptions,
  } = flecks.get('@flecks/electron/server');
  win = new BrowserWindow(browserWindowOptions);
  await flecks.invokeSequentialAsync('@flecks/electron/server.window', win);
}

export default {
  [Hooks]: {
    '@flecks/core.config': () => ({
      /**
       * Browser window options.
       *
       * See: https://www.electronjs.org/docs/latest/api/browser-window
       */
      browserWindowOptions: {},
      /**
       * The URL to load in electron by default.
       *
       * Defaults to `http://${flecks.get('@flecks/web/server.public')}:${flecks.get('@flecks/web/server.port')}`.
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
      // Apple has to be *special*.
      app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
          app.quit();
        }
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
      const {url = `http://${$$public}`} = flecks.get('@flecks/electron/server');
      await win.loadURL(url);
    },
    '@flecks/server.up': async (flecks) => {
      // `app` will be undefined if we aren't running in an electron environment. Just bail.
      if (!app) {
        return;
      }
      await flecks.invokeSequentialAsync('@flecks/electron/server.initialize', app);
    },
  },
};
