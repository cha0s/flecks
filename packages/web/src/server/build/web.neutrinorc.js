const {dirname, join} = require('path');
const {realpath} = require('fs/promises');

const {require: R} = require('@flecks/core/server');
const htmlLoader = require('@neutrinojs/html-loader');
const htmlTemplate = require('@neutrinojs/html-template');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');
const {EnvironmentPlugin} = require('webpack');

const devServer = require('./dev-server');
const runtime = require('./runtime');
const WaitForManifestPlugin = require('./wait-for-manifest');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

module.exports = async (flecks) => {
  // Build configuration.
  const build = async () => {
    const root = await realpath(
      dirname(R.resolve(join(flecks.resolve('@flecks/web'), 'package.json'))),
    );
    return (neutrino) => {
      const {config, options} = neutrino;
      const isProduction = 'production' === config.get('mode');
      // Environment.
      config
        .plugin('environment')
        .use(EnvironmentPlugin, [{
          FLECKS_CORE_BUILD_TARGET: 'web',
        }]);
      // Entrypoints.
      const {output: originalOutput} = options;
      options.mains.index = join(root, 'server', 'build', 'entry');
      options.mains.tests = {
        entry: join(root, 'server', 'build', 'tests'),
        title: 'Testbed',
      };
      options.output = join(originalOutput, flecks.get('@flecks/web/server.output'));
      // Load HTML.
      neutrino.use(htmlLoader());
      Object.entries(options.mains).forEach(([name, mainsConfig]) => {
        const {entry, ...htmlTemplateConfig} = mainsConfig;
        config.entry(name).add(entry);
        neutrino.use(
          htmlTemplate({
            chunks: [name],
            filename: `${name}.html`,
            inject: false,
            pluginId: `html-${name}`,
            template: flecks.buildConfig('template.ejs'),
            templateParameters: (compilation, assets, assetTags, options) => {
              let styleFile;
              const styleChunk = compilation.chunks.find((chunk) => (
                chunk.chunkReason?.match(/split chunk \(cache group: styles\)/)
              ));
              if (isProduction && styleChunk) {
                const modules = styleChunk.getModules();
                const styleFileHref = join(
                  compilation.options.output.publicPath,
                  styleChunk.files.find((file) => file.match(/\.css$/)),
                );
                styleFile = {
                  href: styleFileHref,
                  content: (
                    modules
                      .filter((module) => 'css/mini-extract' === module.type)
                      .map(({content}) => content).join('\n')
                  ),
                };
              }
              return {
                compilation,
                webpackConfig: compilation.options,
                htmlWebpackPlugin: {
                  tags: assetTags,
                  files: assets,
                  options,
                },
                styleFile,
              };
            },
            ...htmlTemplateConfig,
          }),
        );
      });
      // Install source-map-support and fold in existing source maps.
      config.entry('index')
        .add('source-map-support');
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
          cacheGroups: {
            styles: {
              name: !isProduction,
              test: /\.(c|s[ac])ss$/,
              chunks: 'all',
              enforce: true,
              priority: 100,
            },
          },
        })
        .runtimeChunk('single');
      // Output.
      config.output
        .chunkFilename(isProduction ? 'assets/[name].[contenthash:8].js' : 'assets/[name].js')
        .path(options.output)
        .publicPath('/')
        .filename(isProduction ? 'assets/[name].[contenthash:8].js' : 'assets/[name].js');
      config
        .devtool(isProduction ? 'source-map' : 'cheap-module-source-map')
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
        .merge([join(FLECKS_CORE_ROOT, 'node_modules')]);
      // Reporting.
      config.stats({
        ...flecks.get('@flecks/web/server.stats'),
        warningsFilter: [
          /Failed to parse source map/,
        ],
      });
      // Inline the main entrypoint (nice for FCP).
      config
        .plugin('inline-chunks')
        .use(InlineChunkHtmlPlugin, [HtmlWebpackPlugin, [/^assets\/index(\.[^.]*)?\.js$/]]);
      const dll = flecks.get('@flecks/web/server.dll');
      if (!isProduction && dll.length > 0) {
        const manifest = join(
          FLECKS_CORE_ROOT,
          'node_modules',
          '.cache',
          'flecks',
          'web-vendor',
        );
        config
          .plugin('wait-for-manifest')
          .use(WaitForManifestPlugin, [`${manifest}.manifest.json`]);
        config
          .plugin('dll')
          .use(
            R.resolve('webpack/lib/DllReferencePlugin'),
            [
              {
                context: FLECKS_CORE_ROOT,
                manifest: `${manifest}.manifest.json`,
              },
            ],
          );
        config
          .plugin('include-dll')
          .use(
            R.resolve('add-asset-html-webpack-plugin'),
            [
              {
                filepath: `${manifest}.js`,
              },
            ],
          );
      }
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
};
