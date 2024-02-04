const {dirname, join} = require('path');

const {glob} = require('glob');

const {defaultConfig, regexFromExtensions} = require('./webpack');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const source = join(FLECKS_CORE_ROOT, 'src');
const tests = join(FLECKS_CORE_ROOT, 'test');

async function makeMonorepoResolve() {
  const resolve = {alias: {}, fallback: {}};
  const parts = FLECKS_CORE_ROOT.split('/');
  while (parts.length > 1) {
    parts.pop();
    try {
      const candidate = join(parts.join('/'), 'package.json');
      const {workspaces} = require(candidate);
      if (Array.isArray(workspaces)) {
        // eslint-disable-next-line no-await-in-loop
        const workspacePaths = await Promise.all(
          workspaces.map((workspace) => glob(join(dirname(candidate), workspace))),
        );
        workspacePaths
          .flat()
          .forEach((path) => {
            const {name} = require(join(path, 'package.json'));
            resolve.alias[name] = join(path, 'src');
            resolve.fallback[name] = path;
          });
      }
    }
    // eslint-disable-next-line no-empty
    catch (error) {}
  }
  return resolve;
}

module.exports = async (env, argv, flecks) => {
  const {name} = require(join(FLECKS_CORE_ROOT, 'package.json'));
  const resolve = await makeMonorepoResolve();
  const config = defaultConfig(flecks, {
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
    plugins: [],
    resolve: {
      alias: {
        [name]: source,
        ...resolve.alias,
        ...flecks.resolver.aliases,
      },
      fallback: {
        [name]: FLECKS_CORE_ROOT,
        ...resolve.fallback,
        ...flecks.resolver.fallbacks,
      },
      modules: ['node_modules'],
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
  return config;
};
