const configFn = require('../src/server/build/fleck.webpack.config');
const {executable} = require('../src/server/webpack');

module.exports = (env, argv) => {
  const config = configFn(env, argv);
  config.plugins.push(...executable());
  return config;
};
