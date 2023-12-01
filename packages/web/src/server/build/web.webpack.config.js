const {join} = require('path');

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
  const isProduction = 'production' === argv.mode;
  const plugins = [
    // Environment.
    new webpack.EnvironmentPlugin({
      FLECKS_CORE_BUILD_TARGET: 'web',
    }),
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
      process: 'process/browser',
    }),
    // Inline the main entrypoint (nice for FCP).
    new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/^assets\/index(\.[^.]*)?\.js$/]),
  ];
  // DLL
  const dll = flecks.get('@flecks/web/server.dll');
  if (!isProduction && dll.length > 0) {
    const manifest = join(FLECKS_CORE_ROOT, 'node_modules', '.cache', '@flecks', 'web', 'vendor');
    plugins.push(new WaitForManifestPlugin(join(manifest, 'manifest.json')));
    plugins.push(
      new webpack.DllReferencePlugin({
        manifest: join(manifest, 'manifest.json'),
      }),
    );
    plugins.push(
      new AddAssetHtmlPlugin({
        filepath: join(manifest, 'web-vendor.js'),
        outputPath: '/assets',
        publicPath: '/assets',
      }),
    );
  }
  const entry = {};
  [
    ['index', {
      entry: '@flecks/web/server/build/entry',
    }],
    ['tests', {
      entry: '@flecks/web/server/build/tests',
      title: 'Testbed',
    }],
  ]
    .forEach(([name, mainsConfig]) => {
      const {entry: entryPoint, ...htmlTemplateConfig} = mainsConfig;
      // @todo source maps working?
      entry[name] = [entryPoint];
      plugins.push(new HtmlWebpackPlugin({
        appMountId: 'root',
        chunks: [name],
        filename: `${name}.html`,
        inject: false,
        lang: 'en',
        template: flecks.buildConfig('template.ejs', name),
        templateParameters: (compilation, assets, assetTags, options) => {
          const styleFiles = [];
          const styleChunk = Array.from(compilation.chunks).find((chunk) => (
            chunk.chunkReason?.match(/split chunk \(cache group: styles\)/)
          ));
          if (isProduction && styleChunk) {
            for (let i = 0; i < assets.css.length; ++i) {
              const asset = compilation.assets[assets.css[i].substring(1)];
              if (asset) {
                styleFiles.push({content: asset.source(), href: assets.css[i]});
                assetTags.headTags = assetTags.headTags
                  .filter(({attributes}) => attributes?.href !== assets.css[i]);
              }
            }
          }
          return {
            compilation,
            webpackConfig: compilation.options,
            htmlWebpackPlugin: {
              tags: assetTags,
              files: assets,
              options,
            },
            styleFiles,
          };
        },
        ...htmlTemplateConfig,
      }));
    });
  // @todo dynamic extensions
  const styleExtensionsRegex = regexFromExtensions(['.css', '.sass', '.scss']);
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
    devtool: 'source-map',
    entry,
    module: {
      rules: [
        // HTML.
        {
          test: /\.html$/,
          use: ['html-loader'],
        },
        // Fold in existing source maps.
        {
          enforce: 'pre',
          test: styleExtensionsRegex,
          use: ['source-map-loader'],
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
            test: styleExtensionsRegex,
          },
        },
        chunks: 'all',
        ...(isProduction ? {name: false} : undefined),
      },
    },
    output: {
      chunkFilename: isProduction ? 'assets/[name].[contenthash:8].js' : 'assets/[name].js',
      filename: isProduction ? 'assets/[name].[contenthash:8].js' : 'assets/[name].js',
      path: join(FLECKS_CORE_ROOT, 'dist', flecks.get('@flecks/web/server.output')),
      publicPath: '/',
    },
    plugins,
    resolve: {
      fallback: {
        buffer: R.resolve('buffer'),
        child_process: false,
        fs: false,
        path: R.resolve('path-browserify'),
        process: R.resolve('process/browser'),
        stream: R.resolve('stream-browserify'),
        zlib: R.resolve('browserify-zlib'),
      },
    },
    stats: {
      ...flecks.get('@flecks/web/server.stats'),
      warningsFilter: [
        /Failed to parse source map/,
      ],
    },
    target: 'web',
  });
  // Build the client runtime.
  await runtime(config, env, argv, flecks);
  return config;
};
