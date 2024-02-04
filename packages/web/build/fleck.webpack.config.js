const {copy, externals} = require('@flecks/build/src/server');
const configFn = require('@flecks/fleck/build/fleck.webpack.config');

module.exports = async (env, argv, flecks) => {
  const config = await configFn(env, argv, flecks);
  delete config.entry['server/build/entry'];
  delete config.entry['server/build/template'];
  delete config.entry['server/build/tests'];
  config.externals = await externals({
    allowlist: ['mocha/mocha.css'],
  });
  config.plugins.push(
    copy({
      patterns: [
        {
          from: 'src/server/build/entry.js',
          to: 'server/build/entry.js',
          info: { minimized: true },
        },
        {
          from: 'src/server/build/tests.js',
          to: 'server/build/tests.js',
          info: { minimized: true },
        },
      ],
    }),
  );
  return config;
};
