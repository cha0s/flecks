const {
  basename,
  dirname,
  extname,
  join,
} = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const glob = require('glob');

const {defaultConfig, externals, regexFromExtensions} = require('./webpack');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const source = join(FLECKS_CORE_ROOT, 'src');
const tests = join(FLECKS_CORE_ROOT, 'test');

const resolveValidModulePath = (source) => (path) => {
  // Does the file resolve as source?
  try {
    require.resolve(`${source}/${path}`);
  }
  catch (error) {
    const ext = extname(path);
    // Try the implicit [path]/index[.ext] variation.
    try {
      require.resolve(`${source}/${dirname(path)}/${basename(path, ext)}/index${ext}`);
    }
    catch (error) {
      return false;
    }
  }
  return true;
};

module.exports = async (env, argv, flecks) => {
  const {name, files = []} = require(join(FLECKS_CORE_ROOT, 'package.json'));
  const config = defaultConfig(flecks, {
    externals: externals({importType: 'umd'}),
    node: {
      __dirname: false,
      __filename: false,
    },
    optimization: {
      splitChunks: false,
      runtimeChunk: false,
    },
    output: {
      filename: '[name].js',
      library: {
        name,
        type: 'umd',
        umdNamedDefine: true,
      },
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          {
            from: '.',
            to: '.',
            globOptions: {
              dot: true,
              ignore: [
                'dist',
                'node_modules',
              ],
              gitignore: true,
            },
            info: {
              minimized: true,
            },
          },
        ],
      }),
    ],
    resolve: {
      alias: {
        [name]: source,
      },
      fallback: {
        [name]: FLECKS_CORE_ROOT,
      },
    },
    stats: {
      colors: true,
      errorDetails: true,
    },
    target: 'node',
  });
  const babelConfig = await flecks.babel();
  const extensionsRegex = regexFromExtensions(config.resolve.extensions);
  config.module.rules.push(
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
  );
  // Automatic entry registration.
  files
    .filter(resolveValidModulePath(source))
    .forEach((file) => {
      const trimmed = join(dirname(file), basename(file, extname(file)));
      config.entry[trimmed] = `${source}/${trimmed}`;
    });
  // Test entry.
  const testPaths = glob.sync(join(tests, '*.js'));
  const {platforms} = flecks;
  for (let i = 0; i < platforms.length; ++i) {
    testPaths.push(...glob.sync(join(tests, platforms[i], '*.js')));
  }
  if (testPaths.length > 0) {
    config.entry.test = ['source-map-support/register', ...testPaths];
  }
  return config;
};
