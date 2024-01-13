const flecksConfigFn = require('@flecks/core/server/build/webpack.config');

const ProcessAssets = require('./process-assets');

module.exports = async (env, argv, flecks) => {
  const config = await flecksConfigFn(env, argv, flecks);
  config.plugins.push(new ProcessAssets(flecks));
  config.stats = flecks.get('@flecks/fleck/server.stats');
  return config;
};
