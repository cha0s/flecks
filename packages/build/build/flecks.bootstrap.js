const {Flecks} = require('@flecks/core/build/flecks');

exports.hooks = Flecks.hooks(require.context('./hooks'));
