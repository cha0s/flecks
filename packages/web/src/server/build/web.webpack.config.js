const {dirname, join} = require('path');
const {realpath} = require('fs/promises');

const {
  defaultConfig,
  regexFromExtensions,
  require: R,
  webpack,
} = require('@flecks/core/server');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');

const runtime = require('./runtime');
const WaitForManifestPlugin = require('./wait-for-manifest');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

module.exports = async (env, argv, flecks) => {
  const {
    devHost,
    devPort,
    devStats,
    port,
  } = flecks.get('@flecks/web/server');
  const {
    hot,
  } = flecks.get('@flecks/server');
  const isProduction = 'production' === argv.mode;
  const dll = flecks.get('@flecks/web/server.dll');
  const plugins = [];
  const manifest = join(FLECKS_CORE_ROOT, 'node_modules', '.cache', '@flecks', 'web', 'vendor');
  const root = await realpath(
    dirname(R.resolve(join(flecks.resolve('@flecks/web'), 'package.json'))),
  );
  const entryPoints = [
    ['index', {
      entry: join(root, 'server', 'build', 'entry'),
    }],
    ['tests', {
      entry: join(root, 'server', 'build', 'tests'),
      title: 'Testbed',
    }],
  ];
  const entry = {};
  entryPoints.forEach(([name, mainsConfig]) => {
    const {entry: entryPoint, ...htmlTemplateConfig} = mainsConfig;
    // @todo source maps working?
    entry[name] = [entryPoint];
    plugins.push(new HtmlWebpackPlugin({
      appMountId: 'root',
      chunks: [name],
      filename: `${name}.html`,
      inject: false,
      lang: 'en',
      meta: {
        viewport: 'width=device-width, initial-scale=1',
      },
      scriptLoading: 'blocking',
      template: flecks.buildConfig('template.ejs', name),
      templateParameters: (compilation, assets, assetTags, options) => {
        let styleFile;
        const styleChunk = Array.from(compilation.chunks).find((chunk) => (
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
    }));
  });
  const config = defaultConfig(flecks, {
    devServer: {
      compress: false,
      devMiddleware: {
        stats: {
          ...devStats,
          warningsFilter: [
            /Failed to parse source map/,
          ],
        },
      },
      historyApiFallback: {
        disableDotRule: true,
      },
      hot: false,
      host: devHost,
      port: devPort || (port + 1),
    },
    devtool: false,
    entry,
    module: {
      rules: [
        {
          test: regexFromExtensions(['html']),
          use: ['html-loader'],
        },
      ],
    },
    optimization: {
      minimize: isProduction,
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          styles: {
            chunks: 'all',
            enforce: true,
            priority: 100,
            test: /\.(c|s[ac])ss$/,
          },
        },
        chunks: 'all',
        ...(isProduction ? {name: false} : undefined),
      },
    },
    output: {
      chunkFilename: isProduction ? 'assets/[name].[contenthash:8].js' : 'assets/[name].js',
      filename: isProduction ? 'assets/[name].[contenthash:8].js' : 'assets/[name].js',
      publicPath: '/',
    },
    plugins: [
      // Environment.
      new webpack.EnvironmentPlugin({
        FLECKS_CORE_BUILD_TARGET: 'web',
      }),
      new webpack.ProvidePlugin({
        process: 'process/browser',
      }),
      new webpack.SourceMapDevToolPlugin({
        exclude: /^assets\/index(\.[^.]*)?\.js$/,
        // HMR sees a conflict otherwise.
        filename: (isProduction || hot)
          ? 'assets/[name].[contenthash:8].js.map'
          : 'assets/[name].js.map',
      }),
      // Inline the main entrypoint (nice for FCP).
      ...plugins,
      new webpack.SourceMapDevToolPlugin({
        include: /^assets\/index(\.[^.]*)?\.js$/,
      }),
    ],
    resolve: {
      fallback: {
        child_process: false,
        fs: false,
        path: R.resolve('path-browserify'),
        process: R.resolve('process/browser'),
        stream: false,
      },
    },
    stats: {
      ...flecks.get('@flecks/web/server.stats'),
      warningsFilter: [
        /Failed to parse source map/,
      ],
    },
  });
  config.output.path = join(config.output.path, flecks.get('@flecks/web/server.output'));
  if (!isProduction && dll.length > 0) {
    config.plugins.push(new WaitForManifestPlugin(join(manifest, 'manifest.json')));
    config.plugins.push(
      new webpack.DllReferencePlugin({
        manifest: join(manifest, 'manifest.json'),
      }),
    );
    config.plugins.push(
      new AddAssetHtmlPlugin({
        filepath: join(manifest, 'web-vendor.js'),
        outputPath: '/assets',
        publicPath: '/assets',
      }),
    );
  }
  config.plugins.push(
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/^assets\/index(\.[^.]*)?\.js$/]),
  );
  // Fold in existing source maps.
  config.module.rules.push({
    enforce: 'pre',
    test: regexFromExtensions(config.resolve.extensions),
    use: ['source-map-loader'],
  });
  // Build the client runtime.
  await runtime(config, env, argv, flecks);
  return config;
};
