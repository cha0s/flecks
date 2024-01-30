const {processFleckAssets} = require('@flecks/build/build/process-assets');

const commands = require('./commands');

exports.hooks = {
  '@flecks/build.commands': commands,
  '@flecks/core.config': () => ({
    /**
     * Webpack stats configuration.
     */
    stats: {
      colors: true,
      errorDetails: true,
    },
  }),
  '@flecks/build.targets': () => ['fleck'],
  '@flecks/build.processAssets': async (target, assets, compilation, flecks) => {
    if ('fleck' === target) {
      await processFleckAssets(assets, compilation, (json, compilation) => (
        flecks.invokeSequentialAsync('@flecks/fleck.packageJson', json, compilation)
      ));
    }
  },
};