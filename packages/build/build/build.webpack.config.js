const Build = require('./build');
const configFn = require('./fleck.webpack.config');
const {ProcessAssets} = require('./process-assets');
const {executable} = require('./webpack');

module.exports = async (env, argv) => {
  const flecks = await Build.from();
  const config = await configFn(env, argv, flecks);
  config.plugins.push(new ProcessAssets());
  config.plugins.push(executable());
  return config;
};
