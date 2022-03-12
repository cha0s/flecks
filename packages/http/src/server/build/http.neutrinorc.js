const {dirname, join} = require('path');
const {realpath} = require('fs/promises');

const {D} = require('@flecks/core');
const {Flecks, require: R} = require('@flecks/core/server');
const htmlLoader = require('@neutrinojs/html-loader');
const htmlTemplate = require('@neutrinojs/html-template');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const {EnvironmentPlugin} = require('webpack');

const devServer = require('./dev-server');
const runtime = require('./runtime');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const debug = D('@flecks/http/http.neutrino.js');

module.exports = (async () => {
  debug('bootstrapping flecks...');
  const flecks = Flecks.bootstrap();
  debug('bootstrapped');
  // Build configuration.
  const build = async () => {
    const root = await realpath(
      dirname(R.resolve(join(flecks.resolve('@flecks/http'), 'entry.js'))),
    );
    return (neutrino) => {
      const {config, options} = neutrino;
      const isProduction = 'production' === config.get('mode');
      // Environment.
      config
        .plugin('environment')
        .use(EnvironmentPlugin, [{
          FLECKS_CORE_BUILD_TARGET: 'client',
        }]);
      // Entrypoints.
      const {output: originalOutput} = options;
      options.mains.index = join(root, 'entry');
      options.mains.tests = {
        entry: join(root, 'client', 'tests'),
        title: 'Testbed',
      };
      options.output = join(originalOutput, flecks.get('@flecks/http/server.output'));
      neutrino.use(htmlLoader());
      Object.entries(options.mains).forEach(([name, mainsConfig]) => {
        const {entry, ...htmlTemplateConfig} = mainsConfig;
        config.entry(name).add(entry);
        neutrino.use(
          htmlTemplate({
            pluginId: `html-${name}`,
            filename: `${name}.html`,
            chunks: [name],
            inject: false,
            template: flecks.buildConfig('template.ejs'),
            ...htmlTemplateConfig,
          }),
        );
      });
      // Fold in existing source maps.
      config.module
        .rule('maps')
        .test(/\.js$/)
        .enforce('pre')
        .use('source-map-loader')
        .loader('source-map-loader');
      // Optimization.
      config.optimization
        .minimize(isProduction)
        .splitChunks({
          chunks: 'all',
          name: !isProduction,
        })
        .runtimeChunk('single');
      // Outputs.
      config.output
        .chunkFilename(isProduction ? 'assets/[name].[contenthash:8].js' : 'assets/[name].js')
        .path(options.output)
        .publicPath('/')
        .filename(isProduction ? 'assets/[name].[contenthash:8].js' : 'assets/[name].js');
      config
        .devtool('source-map')
        .target('web');
      config.node
        .set('Buffer', true)
        .set('fs', 'empty')
        .set('tls', 'empty')
        .set('__dirname', false)
        .set('__filename', false);
      // Resolution.
      config.resolve.extensions
        .merge([
          '.wasm',
          ...options.extensions.map((ext) => `.${ext}`),
          '.json',
        ]);
      config.resolve.modules
        .merge([
          join(FLECKS_CORE_ROOT, 'node_modules'),
          'node_modules',
        ]);
      // Reporting.
      config.stats(flecks.get('@flecks/http/server.stats'));
      // Inline the main entrypoint (nice for FCP).
      config
        .plugin('inline-chunks')
        .use(InlineChunkHtmlPlugin, [HtmlWebpackPlugin, [/^assets\/index(\.[^.]*)?\.js$/]]);
    };
  };
  // Neutrino configuration.
  const config = {
    options: {
      output: 'dist',
      root: FLECKS_CORE_ROOT,
    },
    use: [
      await build(),
    ],
  };
  // Configure dev server.
  config.use.push(devServer(flecks));
  // Build the client runtime.
  config.use.push(await runtime(flecks));
  return config;
})();
