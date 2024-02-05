const {access, chmod} = require('fs/promises');
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
      modules: [],
    },
    resolveLoader: {
      alias: {},
      extensions,
      fallback: {},
      modules: ['node_modules'],
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
      compiler.hooks.afterEmit.tapPromise(
        'Executable',
        async () => (
          chmod(join(FLECKS_CORE_ROOT, 'dist', 'fleck', 'build', 'cli.js'), 0o755)
        ),
      );
    }

  }()
);

exports.externals = async (options = {}) => {
  const parts = FLECKS_CORE_ROOT.split('/');
  const additionalModuleDirs = [];
  while (parts.length > 1) {
    parts.pop();
    const candidate = join(parts.join('/'), 'node_modules');
    try {
      // eslint-disable-next-line no-await-in-loop
      await access(candidate);
      additionalModuleDirs.push(candidate);
    }
    // eslint-disable-next-line no-empty
    catch (error) {}
  }
  try {
    // eslint-disable-next-line no-await-in-loop
    await access('/node_modules');
    additionalModuleDirs.push('/node_modules');
  }
  // eslint-disable-next-line no-empty
  catch (error) {}
  return nodeExternals({
    importType: 'umd',
    ...options,
    additionalModuleDirs: [
      ...additionalModuleDirs,
      ...(options.additionalModuleDirs || []),
    ],
  });
};

exports.regexFromExtensions = (exts) => (
  new RegExp(String.raw`(?:${exts.map((ext) => ext.replaceAll('.', '\\.')).join('|')})$`)
);

exports.webpack = webpack;
