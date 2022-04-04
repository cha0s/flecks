const {join} = require('path');

const {require: R} = require('@flecks/core/server');
const banner = require('@neutrinojs/banner');
const clean = require('@neutrinojs/clean');
const startServer = require('@neutrinojs/start-server');

const runtime = require('./runtime');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

module.exports = async (flecks) => {
  const {
    hot,
    nodeArgs,
    start: isStarting,
  } = flecks.get('@flecks/server');

  const server = (neutrino) => {
    const {config, options} = neutrino;
    const isProduction = 'production' === config.get('mode');
    neutrino.use(banner());
    neutrino.use(clean({cleanStaleWebpackAssets: false}));
    // Entrypoints.
    config.context(options.root);
    const entries = config.entry('index');
    if (!isProduction && hot) {
      config
        .plugin('hot')
        .use(R.resolve('webpack/lib/HotModuleReplacementPlugin'));
      entries.add('webpack/hot/signal');
    }
    entries.add('@flecks/server/entry');
    // Fold in existing source maps.
    config.module
      .rule('maps')
      .test(/\.js$/)
      .enforce('pre')
      .use('source-map-loader')
      .loader('source-map-loader');
    // Resolution.
    config.resolve.extensions
      .merge([
        '.wasm',
        ...options.extensions.map((ext) => `.${ext}`),
        '.json',
      ]);
    // Reporting.
    config.stats({
      ...flecks.get('@flecks/server.stats'),
      warningsFilter: [
        /Failed to parse source map/,
      ],
    });
    // Outputs.
    config.output
      .path(options.output)
      .libraryTarget('commonjs2');
    config.node
      .set('__dirname', false)
      .set('__filename', false);
    config
      .devtool('source-map')
      .target('node');
  };

  // Augment the application-starting configuration.
  const start = (neutrino) => {
    if (isStarting) {
      neutrino.use(startServer({name: 'index.js'}));
      // Really dumb that I can't just pass these in.
      neutrino.config
        .plugin('start-server')
        .tap((args) => {
          const options = args[0];
          options.keyboard = false;
          // HMR.
          options.signal = !!hot;
          // Node args.
          options.nodeArgs.push(...nodeArgs);
          // Bail hard on unhandled rejections and report.
          options.nodeArgs.push('--unhandled-rejections=strict');
          options.nodeArgs.push('--trace-uncaught');
          return args;
        });

    }
  };

  const config = {
    options: {
      output: 'dist',
      root: FLECKS_CORE_ROOT,
    },
    use: [
      server,
      start,
    ],
  };

  // Build the server runtime.
  config.use.push(await runtime(flecks));

  // Give the resolver a helping hand.
  config.use.push(({config}) => {
    config.resolve.modules.merge([join(FLECKS_CORE_ROOT, 'node_modules')]);
  });

  return config;
};
