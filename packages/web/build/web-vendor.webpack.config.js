const {join} = require('path');

const {defaultConfig, webpack} = require('@flecks/build/server');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

module.exports = async (env, argv, flecks) => {
  const config = defaultConfig(flecks, {
    output: {
      clean: false,
      path: join(FLECKS_CORE_ROOT, 'node_modules', '.cache', '@flecks', 'web', 'vendor'),
      library: 'flecks_web_vendor',
      filename: 'web-vendor.js',
    },
    plugins: [
      // `config.clean` wipes out the manifest...
      new CleanWebpackPlugin({
        cleanStaleWebpackAssets: false,
      }),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      }),
    ],
    resolve: {
      fallback: {
        assert: require.resolve('assert'),
        child_process: false,
        fs: false,
        path: require.resolve('path-browserify'),
        process: require.resolve('process/browser'),
        stream: false,
        util: require.resolve('util'),
      },
      modules: flecks.resolver.modules,
    },
    stats: {
      warningsFilter: [
        /Failed to parse source map/,
      ],
      ...flecks.get('@flecks/web.stats'),
    },
  });
  const dll = flecks.get('@flecks/web.dll');
  if (dll.length > 0) {
    // Build the library and manifest.
    config.entry.index = dll;
    config.plugins.push(
      new webpack.DllPlugin({
        path: join(config.output.path, 'manifest.json'),
        name: 'flecks_web_vendor',
      }),
    );
  }
  return config;
};
