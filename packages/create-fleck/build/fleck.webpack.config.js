const {copy, executable} = require('@flecks/core/server');
// eslint-disable-next-line import/no-extraneous-dependencies
const configFn = require('@flecks/fleck/server/build/fleck.webpack.config');

module.exports = async (env, argv, flecks) => {
  const config = await configFn(env, argv, flecks);
  config.plugins.push(...executable());
  config.plugins.push(copy({
    patterns: [
      {
        from: 'template',
        to: 'template',
      },
    ],
  }));
  return config;
};
