export const hooks = {

  /**
   * Alter the options for initialization of the Electron browser window.
   * @param {[BrowserWindowConstructorOptions](https://www.electronjs.org/docs/latest/api/structures/browser-window-options)} browserWindowOptions The options.
   * @invoke SequentialAsync
   */
  '@flecks/electron/server.browserWindowOptions.alter': (browserWindowOptions) => {
    browserWindowOptions.icon = 'cute-kitten.png';
  },

  /**
   * Extensions to install.
   * @param {[Installer](https://github.com/MarshallOfSound/electron-devtools-installer)} installer The installer.
   * @invoke Flat
   */
  '@flecks/electron/server.extensions': (installer) => [
    // Some defaults provided...
    installer.BACKBONE_DEBUGGER,
    // By ID (Tamper Monkey):
    'dhdgffkkebhmkfjojejmpbldmpobfkfo',
  ],

  /**
   * Invoked when electron is initializing.
   * @param {Electron} electron The electron module.
   * @invoke SequentialAsync
   */
  '@flecks/electron/server.initialize': (electron) => {
    electron.app.on('will-quit', () => {
      // ...
    });
  },

  /**
   * Invoked when a window is created
   * @param {Electron.BrowserWindow} win The electron browser window. See: https://www.electronjs.org/docs/latest/api/browser-window
   * @invoke SequentialAsync
   */
  '@flecks/electron/server.window': (win) => {
    win.maximize();
  },
};

