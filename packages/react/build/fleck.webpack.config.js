const {join} = require('path');

const {externals} = require('@flecks/build/src/server');
const configFn = require('@flecks/fleck/build/fleck.webpack.config');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

module.exports = async (env, argv, flecks) => {
  const config = await configFn(env, argv, flecks);
  const {name} = require(join(FLECKS_CORE_ROOT, 'package.json'));
  config.externals = await externals({
    allowlist: [
      new RegExp(`^${name}`),
      'react-tabs/style/react-tabs.css',
    ],
  });
  return config;
};
