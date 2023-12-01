const {
  banner,
  defaultConfig,
  webpack,
} = require('@flecks/core/server');

const runtime = require('./runtime');
const startServer = require('./start');

module.exports = async (env, argv, flecks) => {
  const {
    hot,
    nodeArgs,
    start: isStarting,
  } = flecks.get('@flecks/server');
  const config = defaultConfig(flecks, {
    node: {
      __dirname: false,
      __filename: false,
    },
    output: {
      libraryTarget: 'commonjs2',
    },
    plugins: [
      banner({banner: "require('source-map-support').install();"}),
    ],
    stats: {
      ...flecks.get('@flecks/server.stats'),
      warningsFilter: [
        /Failed to parse source map/,
      ],
    },
    target: 'node',
  });
  const isProduction = 'production' === argv.mode;
  // Entrypoints.
  config.entry.index = [];
  if (!isProduction && hot) {
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.entry.index.push('webpack/hot/signal');
  }
  config.entry.index.push('@flecks/server/entry');
  // Augment the application-starting configuration.
  if (isStarting) {
    config.plugins.push(
      startServer({
        exec: 'index.js',
        // Bail hard on unhandled rejections and report.
        nodeArgs: [...nodeArgs, '--unhandled-rejections=strict', '--trace-uncaught'],
        // HMR.
        signal: !!hot,
      }),
    );
  }
  // Build the server runtime.
  await runtime(config, env, argv, flecks);
  return config;
};
