// eslint-disable-next-line import/no-extraneous-dependencies
const copy = require('@neutrinojs/copy');
const styleLoader = require('@neutrinojs/style-loader');
const nodeExternals = require('webpack-node-externals');

module.exports = (async () => {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  const config = await require('@flecks/fleck/server/build/fleck.neutrinorc');
  config.use.push(({config}) => {
    config.entryPoints.delete('server/build/template');
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
      ],
    }),
  );
  return config;
})();
