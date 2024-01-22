const {chmod} = require('fs');
const {join} = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

exports.banner = (options) => (
  new webpack.BannerPlugin({
    entryOnly: true,
    raw: true,
    ...options,
  })
);

exports.copy = (options) => (new CopyPlugin(options));

exports.defaultConfig = (flecks, specializedConfig) => {
  const extensions = flecks.invokeFlat('@flecks/build.extensions').flat();
  const extensionsRegex = exports.regexFromExtensions(extensions);
  const defaults = {
    context: FLECKS_CORE_ROOT,
    devtool: 'source-map',
    entry: {},
    module: {
      rules: [
        {
          enforce: 'pre',
          test: extensionsRegex,
          use: ['source-map-loader'],
        },
      ],
    },
    output: {
      clean: true,
      path: join(FLECKS_CORE_ROOT, 'dist'),
    },
    plugins: [],
    resolve: {
      alias: {},
      extensions,
      fallback: {},
    },
    stats: {
      colors: true,
      errorDetails: true,
    },
  };
  return 'function' === typeof specializedConfig
    ? specializedConfig(defaults)
    : {
      ...defaults,
      ...specializedConfig,
      module: {
        ...specializedConfig.module,
        rules: [
          ...defaults.module.rules,
          ...(specializedConfig.module?.rules || []),
        ],
      },
      output: {
        ...defaults.output,
        ...specializedConfig.output,
      },
      plugins: [
        ...defaults.plugins,
        ...(specializedConfig.plugins || []),
      ],
      resolve: {
        ...defaults.resolve,
        ...specializedConfig.resolve,
      },
      stats: {
        ...defaults.stats,
        ...specializedConfig.stats,
      },
    };
};

// Include a shebang and set the executable bit..
exports.executable = () => (
  new class Executable {

    // eslint-disable-next-line class-methods-use-this
    apply(compiler) {
      compiler.hooks.afterEmit.tapAsync(
        'Executable',
        (compilation, callback) => {
          chmod(join(FLECKS_CORE_ROOT, 'dist', 'build', 'cli.js'), 0o755, callback);
        },
      );
    }

  }()
);

exports.externals = nodeExternals;

exports.regexFromExtensions = (exts) => (
  new RegExp(String.raw`(?:${exts.map((ext) => ext.replaceAll('.', '\\.')).join('|')})$`)
);

exports.webpack = webpack;
