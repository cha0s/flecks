const {chmod} = require('fs');
const {join} = require('path');

const babelmerge = require('babel-merge');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

const D = require('../debug');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const debug = D('@flecks/core/server/webpack');
const debugSilly = debug.extend('silly');
const source = join(FLECKS_CORE_ROOT, 'src');
const tests = join(FLECKS_CORE_ROOT, 'test');

exports.banner = (options) => (
  new webpack.BannerPlugin({
    entryOnly: true,
    raw: true,
    ...options,
  })
);

exports.copy = (options) => (new CopyPlugin(options));

exports.defaultConfig = (flecks, specializedConfig) => {
  const extensions = ['.mjs', '.js', '.json', '.wasm'];
  const merging = [
    {
      plugins: ['@babel/plugin-syntax-dynamic-import'],
      presets: [
        [
          '@babel/preset-env',
          {
            shippedProposals: true,
            targets: {
              esmodules: true,
              node: 'current',
            },
          },
        ],
      ],
    },
  ];
  if (flecks) {
    extensions.push(...flecks.exts());
    merging.push({configFile: flecks.buildConfig('babel.config.js')});
    const rcBabel = flecks.babel();
    debugSilly('.flecksrc: babel: %j', rcBabel);
    merging.push(...rcBabel.map(([, babel]) => babel));
  }
  const babelConfig = babelmerge.all(merging);
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
        {
          include: [source, tests],
          test: extensionsRegex,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                babelrc: false,
                configFile: false,
                ...babelConfig,
              },
            },
          ],
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
      modules: [
        'node_modules',
        join(FLECKS_CORE_ROOT, 'node_modules'),
      ],
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
exports.executable = () => ([
  exports.banner({
    banner: '#!/usr/bin/env node',
    include: /^cli\.js$/,
  }),
  new class Executable {

    // eslint-disable-next-line class-methods-use-this
    apply(compiler) {
      compiler.hooks.afterEmit.tapAsync(
        'Executable',
        (compilation, callback) => {
          chmod(join(FLECKS_CORE_ROOT, 'dist', 'cli.js'), 0o755, callback);
        },
      );
    }

  }(),
]);

exports.externals = nodeExternals;

exports.regexFromExtensions = (exts) => (
  new RegExp(String.raw`(?:${exts.map((ext) => ext.replace('.', '\\.')).join('|')})$`)
);

exports.webpack = webpack;
