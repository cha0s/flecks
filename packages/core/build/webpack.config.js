const configFn = require('../src/server/build/webpack.config');
const {executable} = require('../src/server/webpack');
const eslintConfigFn = require('../src/server/build/default.eslint.config');

module.exports = async (env, argv) => {
  const config = await configFn(env, argv);
  config.plugins.push(...executable());
  const eslint = await eslintConfigFn();
  eslint.settings['import/resolver'].webpack = {
    config: {
      resolve: config.resolve,
    },
  };
  return config;
};
