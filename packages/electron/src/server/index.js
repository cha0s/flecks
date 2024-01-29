import {Flecks} from '@flecks/core';

const electron = __non_webpack_require__('electron');

let win;

async function createWindow(flecks) {
  const {BrowserWindow} = flecks.electron;
  const {browserWindowOptions} = flecks.get('@flecks/electron');
  await flecks.invokeSequentialAsync(
    '@flecks/electron/server.browserWindowOptions.alter',
    browserWindowOptions,
  );
  win = new BrowserWindow(browserWindowOptions);
  await flecks.invokeSequentialAsync('@flecks/electron/server.window', win);
}

export const hooks = {
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
    const {installExtensions, url = `http://${$$public}`} = flecks.get('@flecks/electron');
    if (installExtensions) {
      const installer = __non_webpack_require__('electron-devtools-installer');
      const {default: installExtension} = installer;
      await installExtension([
        ...Array.isArray(installExtensions) ? installExtensions : [],
        ...flecks.invokeFlat('@flecks/electron/server.extensions', installer)
          .flat(),
      ]);
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

export const mixin = (Flecks) => class FlecksWithElectron extends Flecks {

  electron = electron.app ? electron : undefined;

};
