const Server = require('./server');
const configFn = require('./fleck.webpack.config');
const {executable} = require('./webpack');

module.exports = async (env, argv) => {
  const flecks = await Server.from();
  const config = await configFn(env, argv, flecks);
  config.plugins.push(...executable());
  return config;
};
