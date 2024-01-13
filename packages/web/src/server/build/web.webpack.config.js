const {join} = require('path');

const {
  defaultConfig,
  regexFromExtensions,
  require: R,
  webpack,
} = require('@flecks/core/server');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {htmlTagObjectToString} = require('html-webpack-plugin/lib/html-tags');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');

const runtime = require('./runtime');
const WaitForManifestPlugin = require('./wait-for-manifest');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

module.exports = async (env, argv, flecks) => {
  const {
    appMountId,
    base,
    devHost,
    devPort,
    devStats,
    meta,
    icon,
    port,
    title,
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
        appMountId: flecks.interpolate(appMountId),
        base: flecks.interpolate(base),
        chunks: [name],
        filename: `${name}.html`,
        inject: false,
        lang: 'en',
        meta,
        template: flecks.buildConfig('template.ejs', name),
        templateParameters: (compilation, assets, assetTags, options) => {
          function createTag(tagName, attributes, content) {
            const tag = HtmlWebpackPlugin.createHtmlTagObject(
              tagName,
              attributes,
              content,
              {plugin: '@flecks/web/server'},
            );
            tag.toString = () => htmlTagObjectToString(tag, false);
            return tag;
          }
          if (icon) {
            assetTags.headTags.push('link', {rel: 'icon', href: icon});
          }
          if ('index' === name) {
            const styleChunks = Array.from(compilation.chunks)
              .filter((chunk) => chunk.idNameHints.has('flecksCompiled'));
            for (let i = 0; i < styleChunks.length; ++i) {
              const styleChunk = styleChunks[i];
              const styleChunkFiles = Array.from(styleChunk.files)
                .filter((file) => file.match(/\.css$/));
              const styleAssets = styleChunkFiles.map((filename) => compilation.assets[filename]);
              for (let j = 0; j < styleAssets.length; ++j) {
                const asset = styleAssets[j];
                if (asset) {
                  assetTags.headTags = assetTags.headTags
                    .filter(({attributes}) => attributes?.href !== styleChunkFiles[j]);
                  assetTags.headTags.unshift(
                    createTag(
                      ...isProduction
                        ? [
                          'style',
                          {'data-href': `/${styleChunkFiles[j]}`},
                          asset.source(),
                        ]
                        : [
                          'link',
                          {
                            href: `/${styleChunkFiles[j]}`,
                            rel: 'stylesheet',
                            type: 'text/css',
                          },
                        ],
                    ),
                  );
                }
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
          };
        },
        title: flecks.interpolate(title),
        ...htmlTemplateConfig,
      }));
    });
  // @todo dynamic extensions
  const styleExtensionsRegex = regexFromExtensions(
    ['.css', '.sass', '.scss'].map((ext) => [ext, `.module${ext}`]).flat(),
  );
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
          applicationStyles: {
            chunks: 'all',
            type: 'css/mini-extract',
            enforce: true,
            name: 'applicationStyles',
            priority: 100,
            test: 'index',
          },
        },
        chunks: 'all',
      },
    },
    output: {
      chunkFilename: isProduction ? 'assets/[name].[contenthash:8].js' : 'assets/[name].js',
      filename: isProduction ? 'assets/[name].[contenthash:8].js' : 'assets/[name].js',
      path: join(FLECKS_CORE_ROOT, 'dist', 'web'),
      publicPath: '/',
    },
    plugins,
    resolve: {
      // Resolve the generated `url(assets/*)` style paths.
      alias: {
        assets: '.',
      },
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
