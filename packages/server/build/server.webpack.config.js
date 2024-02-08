const {delimiter, join} = require('path');

const {
  banner,
  defaultConfig,
  externals,
  webpack,
} = require('@flecks/build/src/server');

const D = require('@flecks/core/build/debug');

const debug = D('@flecks/server/build');

const {runtimeModule} = require('./runtime');
const startServer = require('./start');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

module.exports = async (env, argv, flecks) => {
  const {
    hot,
    nodeArgs,
    nodeEnv,
    start: isStarting,
  } = flecks.get('@flecks/server');
  const config = defaultConfig(flecks, {
    node: {
      __dirname: false,
      __filename: false,
    },
    output: {
      path: join(FLECKS_CORE_ROOT, 'dist', 'server'),
    },
    plugins: [
      banner({banner: "require('source-map-support').install();"}),
    ],
    stats: {
      warningsFilter: [
        /Failed to parse source map/,
      ],
      ...flecks.get('@flecks/server.stats'),
    },
    target: 'node',
  });
  const isProduction = 'production' === argv.mode;
  // Entrypoints.
  config.entry.index = [];
  if (!isProduction && hot) {
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
    config.entry.index.push('webpack/hot/signal');
  }
  config.entry.index.push('@flecks/server/entry');
  // Augment the application-starting configuration.
  if (isStarting) {
    config.plugins.push(
      startServer({
        env: {
          ...nodeEnv,
          NODE_PATH: flecks.resolver.modules.join(delimiter),
          NODE_PRESERVE_SYMLINKS: flecks.roots.some(([path, request]) => path !== request) ? 1 : 0,
        },
        exec: 'index.js',
        // Bail hard on unhandled rejections and report.
        nodeArgs: [...nodeArgs, '--unhandled-rejections=strict', '--trace-uncaught'],
        // HMR.
        signal: !!hot,
      }),
    );
  }
  // Create runtime.
  const runtimePath = await flecks.resolver.resolve('@flecks/server/runtime');
  config.module.rules.push(
    {
      test: runtimePath,
      use: [
        {
          loader: runtimePath,
          options: {
            source: await runtimeModule(
              {
                compiler: {
                  options: {
                    mode: argv.mode, output: {path: config.output.path},
                  },
                },
              },
              flecks,
            ),
          },
        },
      ],
    },
  );
  const allowlist = [
    '@flecks/server/entry',
    '@flecks/server/runtime',
    /^@babel\/runtime\/helpers\/esm/,
  ];
  Object.entries(flecks.resolver.aliases).forEach(([path, request]) => {
    debug('server runtime de-externalized %s, alias: %s', path, request);
    allowlist.push(new RegExp(`^${path}`));
  });
  // Stubs.
  flecks.stubs.forEach((stub) => {
    config.resolve.alias[stub] = false;
  });
  await flecks.runtimeCompiler('server', config, env, argv);
  // Rewrite to signals for HMR.
  if ('production' !== argv.mode) {
    allowlist.push(/^webpack\/hot\/signal/);
  }
  // Externalize the rest.
  config.externals = await externals({
    additionalModuleDirs: flecks.resolver.modules,
    allowlist,
    importType: 'commonjs',
  });
  return config;
};
