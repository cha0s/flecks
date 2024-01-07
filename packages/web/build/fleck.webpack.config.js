const {copy, externals} = require('@flecks/core/server');
// eslint-disable-next-line import/no-extraneous-dependencies
const configFn = require('@flecks/fleck/server/build/fleck.webpack.config');

module.exports = async (env, argv, flecks) => {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  const config = await configFn(env, argv, flecks);
  delete config.entry['server/build/entry'];
  delete config.entry['server/build/template'];
  delete config.entry['server/build/tests'];
  config.externals = externals({
    allowlist: ['mocha/mocha.css'],
    importType: 'umd',
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
          from: 'src/server/build/template.ejs',
          to: 'server/build/template.ejs',
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
