const {inspect: {defaultOptions}} = require('util');

defaultOptions.breakLength = 160;
defaultOptions.compact = 6;
defaultOptions.sorted = true;

exports.hooks = {
  '@flecks/core.config': () => ({
    /**
     * The ID of your application.
     */
    id: 'flecks',
  }),
};
