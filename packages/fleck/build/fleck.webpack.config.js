const flecksConfigFn = require('@flecks/build/build/fleck.webpack.config');

module.exports = async (env, argv, flecks) => {
  const config = await flecksConfigFn(env, argv, flecks);
  config.stats = flecks.get('@flecks/fleck.stats');
  return config;
};
