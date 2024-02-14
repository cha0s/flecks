const {Flecks} = require('@flecks/core/build/flecks');

exports.dependencies = ['@flecks/build'];

exports.hooks = Flecks.hooks(require.context('./hooks'));
