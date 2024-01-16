import {Flecks} from '@flecks/core';

const electron = __non_webpack_require__('electron');

const {
  NODE_ENV,
} = process.env;

let win;

async function createWindow(flecks) {
  const {BrowserWindow} = flecks.electron;
  const {browserWindowOptions} = flecks.get('@flecks/electron');
  flecks.invoke('@flecks/electron/server.browserWindowOptions.alter', browserWindowOptions);
  win = new BrowserWindow(browserWindowOptions);
  await flecks.invokeSequentialAsync('@flecks/electron/server.window', win);
}

export const hooks = {
  '@flecks/core.mixin': (Flecks) => (
    class FlecksWithElectron extends Flecks {

      electron = electron.app ? electron : undefined;

    }
  ),
  '@flecks/electron/server.initialize': async (electron, flecks) => {
    electron.app.on('window-all-closed', () => {
      const {quitOnClosed} = flecks.get('@flecks/electron');
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
    const {public: $$public} = flecks.get('@flecks/web');
    const {
      installExtensions,
      url = `http://${$$public}`,
    } = flecks.get('@flecks/electron');
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
  '@flecks/server.up': Flecks.priority(
    async (flecks) => {
      if (flecks.electron) {
        await flecks.invokeSequentialAsync('@flecks/electron/server.initialize', flecks.electron);
      }
    },
    {after: '@flecks/web/server', before: '@flecks/repl/server'},
  ),
};
