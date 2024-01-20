const {externals} = require('@flecks/core/server');

module.exports = async (config, env, argv, flecks) => {
  const runtime = await flecks.resolver.resolve('@flecks/server/runtime');
  // Inject flecks configuration.
  const paths = Object.keys(flecks.flecks);
  const resolvedPaths = (await Promise.all(
    paths.map(async (path) => [path, await flecks.resolver.resolve(path)]),
  ))
    .filter(([, resolved]) => resolved)
    .map(([path]) => path);
  const source = [
    "process.env.FLECKS_CORE_BUILD_TARGET = 'server';",
    'module.exports = (async () => ({',
    `  config: ${JSON.stringify(flecks.config)},`,
    '  loadFlecks: async () => Object.fromEntries(await Promise.all([',
    ...resolvedPaths.map((path) => (
      `    ['${path}', import('${path}')],`
    )),
    '  ].map(async ([path, M]) => [path, await M]))),',
    `  stubs: ${JSON.stringify(flecks.stubs.map((stub) => (
      stub instanceof RegExp ? [stub.source, stub.flags] : stub
    )))}`,
    '}))();',
  ];
  // HMR.
  source.push('if (module.hot) {');
  // Keep HMR junk out of our output path.
  source.push('  const {unlink} = require("fs/promises");');
  source.push('  const {join} = require("path");');
  source.push('  let previousHash = __webpack_hash__;');
  source.push('  module.hot.addStatusHandler((status) => {');
  source.push('    if ("idle" === status) {');
  source.push('      require("glob")(');
  source.push(`        join('${config.output.path}', \`*\${previousHash}.hot-update.*\`),`);
  source.push('        async (error, disposing) => {');
  source.push('          if (error) {');
  source.push('            throw error;');
  source.push('            return;');
  source.push('          }');
  source.push('          await Promise.all(disposing.map(unlink));');
  source.push('        },');
  source.push('      );');
  source.push('      previousHash = __webpack_hash__;');
  source.push('    }');
  source.push('  });');
  // Hooks for each fleck.
  resolvedPaths.forEach((path) => {
    source.push(`  module.hot.accept('${path}', async () => {`);
    source.push(`    global.flecks.refresh('${path}', require('${path}'));`);
    source.push(`    global.flecks.invoke('@flecks/core.hmr', '${path}');`);
    source.push('  });');
  });
  source.push('}');
  // Create runtime.
  config.module.rules.push(
    {
      test: runtime,
      use: [
        {
          loader: runtime,
          options: {
            source: source.join('\n'),
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
  config.resolve.alias['@flecks/server/runtime$'] = runtime;
  const nodeExternalsConfig = {
    allowlist,
  };
  await flecks.runtimeCompiler('server', config, nodeExternalsConfig);
  // Rewrite to signals for HMR.
  if ('production' !== argv.mode) {
    allowlist.push(/^webpack/);
  }
  // Externalize the rest.
  config.externals = externals(nodeExternalsConfig);
};
