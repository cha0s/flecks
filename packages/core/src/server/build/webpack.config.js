const {
  basename,
  dirname,
  extname,
  join,
} = require('path');

const babelmerge = require('babel-merge');
const CopyPlugin = require('copy-webpack-plugin');
const glob = require('glob');

const D = require('../../debug');
const R = require('../../require');
const {defaultConfig, externals, regexFromExtensions} = require('../webpack');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const debug = D('@flecks/core/server/build/fleck.webpack.config.js');
const debugSilly = debug.extend('silly');

const source = join(FLECKS_CORE_ROOT, 'src');
const tests = join(FLECKS_CORE_ROOT, 'test');

const resolveValidModulePath = (source) => (path) => {
  // Does the file resolve as source?
  try {
    R.resolve(`${source}/${path}`);
  }
  catch (error) {
    const ext = extname(path);
    // Try the implicit [path]/index[.ext] variation.
    try {
      R.resolve(`${source}/${dirname(path)}/${basename(path, ext)}/index${ext}`);
    }
    catch (error) {
      return false;
    }
  }
  return true;
};

module.exports = (env, argv, flecks) => {
  const {name, files = []} = R(join(FLECKS_CORE_ROOT, 'package.json'));
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
    },
    stats: {
      colors: true,
      errorDetails: true,
    },
    target: 'node',
  });
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
    merging.push({configFile: flecks.buildConfig('babel.config.js')});
    const flecksBabelConfig = flecks.babel();
    debugSilly('flecks.config.js: babel: %j', flecksBabelConfig);
    merging.push(...flecksBabelConfig.map(([, babel]) => babel));
  }
  const babelConfig = babelmerge.all(merging);
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
  const platforms = flecks
    ? flecks.platforms
    : ['server'];
  for (let i = 0; i < platforms.length; ++i) {
    testPaths.push(...glob.sync(join(tests, `platforms/${platforms[i]}/*.js`)));
  }
  if (testPaths.length > 0) {
    config.entry.test = testPaths;
  }
  return config;
};
