const {copy} = require('@flecks/build/src/server');
const configFn = require('@flecks/fleck/build/fleck.webpack.config');

module.exports = async (env, argv, flecks) => {
  const config = await configFn(env, argv, flecks);
  delete config.entry.entry;
  config.plugins.push(
    copy({
      patterns: [
        {
          from: 'src/entry.js',
          to: 'entry.js',
          info: { minimized: true },
        },
      ],
    }),
  );
  return config;
};
