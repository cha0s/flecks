const {copy, executable} = require('@flecks/core/server');

module.exports = async (env, argv, flecks) => {
  // eslint-disable-next-line global-require
  const config = await require('@flecks/fleck/server/build/fleck.webpack.config')(env, argv, flecks);
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
