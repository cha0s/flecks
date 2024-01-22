const {join} = require('path');

const {hook} = require('@flecks/build/build/process-assets');

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
  '@flecks/core.targets': () => ['fleck'],
  '@flecks/build.processAssets': hook,
};
