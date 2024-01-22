const Build = require('../../build/build/build');
const configFn = require('../../build/build/fleck.webpack.config');
const {ProcessAssets} = require('../../build/build/process-assets');

module.exports = async (env, argv) => {
  const flecks = await Build.from();
  const config = await configFn(env, argv, flecks);
  config.plugins.push(new ProcessAssets());
  return config;
};
