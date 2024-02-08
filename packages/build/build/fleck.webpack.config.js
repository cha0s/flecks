const {
  basename,
  dirname,
  extname,
  join,
} = require('path');

const CopyPlugin = require('copy-webpack-plugin');

const configFn = require('./common.webpack.config');
const {externals} = require('./webpack');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const source = join(FLECKS_CORE_ROOT, 'src');

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
  const config = await configFn(env, argv, flecks);
  const {name} = require(join(FLECKS_CORE_ROOT, 'package.json'));
  config.externals = await externals({allowlist: [new RegExp(`^${name}`)]});
  config.output.path = join(FLECKS_CORE_ROOT, 'dist', 'fleck');
  config.plugins.push(
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
  );
  const {files = []} = require(join(FLECKS_CORE_ROOT, 'package.json'));
  // Automatic entry registration.
  files
    .filter(resolveValidModulePath(source))
    .forEach((file) => {
      const trimmed = join(dirname(file), basename(file, extname(file)));
      config.entry[trimmed] = `${source}/${trimmed}`;
    });
  return config;
};
