const {
  basename,
  dirname,
  extname,
  join,
} = require('path');

const CopyPlugin = require('copy-webpack-plugin');
const glob = require('glob');
const ESLintPlugin = require('eslint-webpack-plugin');

const R = require('../../require');
const {defaultConfig, externals} = require('../webpack');
const eslint = require('./default.eslint.config');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

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
      new ESLintPlugin({
        cache: true,
        cwd: FLECKS_CORE_ROOT,
        emitWarning: argv.mode !== 'production',
        failOnError: argv.mode === 'production',
        useEslintrc: false,
        overrideConfig: eslint,
      }),
    ],
    resolve: {
      alias: {
        [name]: source,
      },
      fallback: {
        child_process: false,
        fs: false,
        path: R.resolve('path-browserify'),
        process: R.resolve('process/browser'),
        stream: false,
      },
    },
    // stats: {
    //   assetsSort: 'name',
    //   assetsSpace: Infinity,
    //   children: false,
    //   excludeAssets: [/^(?:build|src|test)\//],
    //   groupAssetsByChunk: false,
    //   groupAssetsByEmitStatus: false,
    //   groupAssetsByExtension: false,
    //   groupAssetsByInfo: false,
    //   groupAssetsByPath: false,
    //   modules: false,
    // },
    target: 'node',
  });
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
