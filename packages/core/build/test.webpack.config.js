const Build = require('../../build/build/build');
const configFn = require('../../build/build/test.webpack.config');

module.exports = async (env, argv) => {
  const flecks = await Build.from();
  const config = await configFn(env, argv, flecks);
  return config;
};
