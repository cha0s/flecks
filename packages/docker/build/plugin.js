const {dumpYml} = require('@flecks/core/src/server');

const {generateComposeConfig, generateDockerFile} = require('./generate');

module.exports = class FlecksDockerOutput {

  constructor(options) {
    this.options = options;
  }

  // eslint-disable-next-line class-methods-use-this
  apply(compiler) {
    compiler.hooks.compilation.tap('FlecksDockerOutput', (compilation) => {
      compilation.hooks.additionalAssets.tapAsync('FlecksDockerOutput', async (callback) => {
        const dockerFile = await generateDockerFile(this.options.flecks);
        compilation.assets.Dockerfile = {
          source: () => dockerFile,
          size: () => dockerFile.length,
        };
        const composeConfig = await generateComposeConfig(this.options.flecks);
        const composeFile = dumpYml(composeConfig);
        compilation.assets['docker-compose.yml'] = {
          source: () => composeFile,
          size: () => composeFile.length,
        };
        callback();
      });
    });
  }

};
