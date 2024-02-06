const {delimiter, join} = require('path');

const {
  banner,
  defaultConfig,
  webpack,
} = require('@flecks/build/src/server');

const runtime = require('./runtime');
const startServer = require('./start');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

module.exports = async (env, argv, flecks) => {
  const {
    hot,
    nodeArgs,
    nodeEnv,
    start: isStarting,
  } = flecks.get('@flecks/server');
  const config = defaultConfig(flecks, {
    node: {
      __dirname: false,
      __filename: false,
    },
    output: {
      libraryTarget: 'commonjs2',
      path: join(FLECKS_CORE_ROOT, 'dist', 'server'),
    },
    plugins: [
      banner({banner: "require('source-map-support').install();"}),
    ],
    stats: {
      warningsFilter: [
        /Failed to parse source map/,
      ],
      ...flecks.get('@flecks/server.stats'),
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
        env: {
          ...nodeEnv,
          NODE_PATH: flecks.resolver.modules.join(delimiter),
          NODE_PRESERVE_SYMLINKS: flecks.roots.some(([path, request]) => path !== request) ? 1 : 0,
        },
        exec: 'index.js',
        killOnExit: !hot,
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
