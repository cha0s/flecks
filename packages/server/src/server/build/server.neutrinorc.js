const {join} = require('path');

const {D} = require('@flecks/core');
const {Flecks, require: R} = require('@flecks/core/server');
const banner = require('@neutrinojs/banner');
const clean = require('@neutrinojs/clean');
const startServer = require('@neutrinojs/start-server');

const runtime = require('./runtime');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const debug = D('@flecks/server/server.neutrino.js');

module.exports = (async () => {

  debug('bootstrapping flecks...');
  const flecks = Flecks.bootstrap();
  debug('bootstrapped');

  const {
    hot,
    inspect,
    profile,
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
    config.stats(flecks.get('@flecks/server.stats'));
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
          // Debugging.
          if (inspect) {
            options.nodeArgs.push('--inspect');
          }
          // Profiling.
          if (profile) {
            options.nodeArgs.push('--prof');
          }
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

  // Stub out non-server-friendly modules on the server.
  const stubs = flecks.stubs();
  if (Object.keys(stubs).length > 0) {
    config.use.unshift(({config}) => {
      Object.keys(stubs).forEach((path) => {
        config.resolve.alias
          .set(path, '@flecks/core/empty');
      });
    });
  }
  // Hardcore hax for module aliasing.
  const aliases = flecks.aliases();
  if (Object.keys(aliases).length > 0) {
    const code = [
      `const aliases = ${JSON.stringify(aliases)};`,
      `const stubs = ${JSON.stringify(stubs)};`,
      'const {Module} = require("module");',
      'const {require: Mr} = Module.prototype;',
      'Module.prototype.require = function hackedRequire(request, options) {',
      '  if (stubs[request]) {',
      '    return undefined;',
      '  }',
      '  if (aliases[request]) {',
      '    return Mr.call(this, aliases[request], options);',
      '  }',
      '  return Mr.call(this, request, options);',
      '};',
    ].join('\n');
    config.use.push(banner({
      banner: code,
      pluginId: 'aliases-banner',
    }));
  }

  // Build the server runtime.
  config.use.push(await runtime(flecks));

  // Give the resolver a helping hand.
  config.use.push(({config}) => {
    config.resolve.modules.merge([
      join(FLECKS_CORE_ROOT, 'node_modules'),
      'node_modules',
    ]);
  });

  return config;
})();
