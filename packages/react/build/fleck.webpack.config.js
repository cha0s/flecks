const {externals} = require('@flecks/build/src/server');
const configFn = require('@flecks/fleck/build/fleck.webpack.config');

module.exports = async (env, argv, flecks) => {
  const config = await configFn(env, argv, flecks);
  config.externals = await externals({
    allowlist: ['react-tabs/style/react-tabs.css'],
  });
  return config;
};
