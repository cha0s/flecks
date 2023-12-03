const flecksConfigFn = require('@flecks/core/server/build/webpack.config');

module.exports = async (env, argv, flecks) => {
  const config = await flecksConfigFn(env, argv, flecks);
  config.stats = flecks.get('@flecks/fleck/server.stats');
  return config;
};
