// eslint-disable-next-line import/no-extraneous-dependencies
const copy = require('@neutrinojs/copy');
const styleLoader = require('@neutrinojs/style-loader');
const nodeExternals = require('webpack-node-externals');

module.exports = async (flecks) => {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  const config = await require('@flecks/fleck/server/build/fleck.neutrinorc')(flecks);
  config.use.push(({config}) => {
    config.entryPoints.delete('server/build/template');
    config.entryPoints.delete('server/build/tests');
    config.externals(nodeExternals({
      allowlist: ['mocha/mocha.css'],
      importType: 'umd',
    }));
  });
  config.use.push(styleLoader({
    extract: {
      enabled: false,
    },
    style: {
      injectType: 'lazyStyleTag',
    },
  }));
  config.use.push(
    copy({
      copyUnmodified: true,
      patterns: [
        {
          from: 'src/server/build/template.ejs',
          to: 'server/build/template.ejs',
        },
        {
          from: 'src/server/build/tests.js',
          to: 'server/build/tests.js',
        },
      ],
    }),
  );
  return config;
};
