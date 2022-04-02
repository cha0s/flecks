import {Hooks} from '@flecks/core';
import {
  app,
  BrowserWindow,
} from 'electron';

let win;

async function createWindow(flecks) {
  const {
    browserWindowOptions,
  } = flecks.get('@flecks/electron/server');
  win = new BrowserWindow(browserWindowOptions);
  await flecks.invokeSequentialAsync('@flecks/electron.window', win);
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
       * Defaults to `http://localhost:${flecks.get('@flecks/web/server.port')}`.
       */
      url: undefined,
    }),
    '@flecks/electron.initialize': async (app, flecks) => {
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
    '@flecks/electron.window': async (win, flecks) => {
      const {
        url = `http://localhost:${flecks.get('@flecks/web/server.port')}`,
      } = flecks.get('@flecks/electron/server');
      await win.loadURL(url);
    },
    '@flecks/server.up': async (flecks) => {
      // `app` will be undefined if we aren't running in an electron environment. Just bail.
      if (!app) {
        return;
      }
      await flecks.invokeSequentialAsync('@flecks/electron.initialize', app);
    },
  },
};
