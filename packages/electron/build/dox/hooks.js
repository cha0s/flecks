import {Hooks} from '@flecks/core';

export default {
  [Hooks]: {
    /**
     * Invoked when electron is initializing.
     * @param {Electron.App} app The electron app. See: https://www.electronjs.org/docs/latest/api/app
     */
    '@flecks/electron.initialize': (app) => {
      app.on('will-quit', () => {
        // ...
      });
    },

    /**
     * Invoked when a window is created
     * @param {Electron.BrowserWindow} win The electron browser window. See: https://www.electronjs.org/docs/latest/api/browser-window
     */
    '@flecks/electron.window': (win) => {
      win.maximize();
    },
  },
};

