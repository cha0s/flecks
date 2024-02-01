const {copy, executable} = require('@flecks/build/server');
const configFn = require('@flecks/fleck/build/fleck.webpack.config');

module.exports = async (env, argv, flecks) => {
  const config = await configFn(env, argv, flecks);
  config.plugins.push(executable());
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
