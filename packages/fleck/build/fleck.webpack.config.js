const flecksConfigFn = require('@flecks/build/build/fleck.webpack.config');

const {ProcessAssets} = require('@flecks/build/build/process-assets');

module.exports = async (env, argv, flecks) => {
  const config = await flecksConfigFn(env, argv, flecks);
  config.plugins.push(new ProcessAssets(flecks));
  config.stats = flecks.get('@flecks/fleck.stats');
  return config;
};
