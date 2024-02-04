const Build = require('./build');
const configFn = require('./test.webpack.config');

module.exports = async (env, argv) => {
  const flecks = await Build.from();
  const config = await configFn(env, argv, flecks);
  return config;
};
