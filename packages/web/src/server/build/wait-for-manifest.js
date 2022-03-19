const {stat} = require('fs/promises');

const WebpackBeforeBuildPlugin = require('before-build-webpack');

class WaitForManifestPlugin extends WebpackBeforeBuildPlugin {

  constructor(manifest) {

    super(async (stats, callback) => {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        try {
          // eslint-disable-next-line no-await-in-loop
          await stat(manifest);
          callback();
          break;
        }
        catch (error) {
          // eslint-disable-next-line no-await-in-loop
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }, ['beforeCompile']);

  }

}

module.exports = WaitForManifestPlugin;
