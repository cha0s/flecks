const {externals} = require('@flecks/build/server');

const D = require('@flecks/core/build/debug');

const debug = D('@flecks/server/build/runtime');

module.exports = async (config, env, argv, flecks) => {
  const runtimePath = await flecks.resolver.resolve('@flecks/server/runtime');
  // Inject flecks configuration.
  const paths = Object.keys(flecks.flecks);
  const resolvedPaths = (await Promise.all(
    paths.map(async (path) => [path, await flecks.resolver.resolve(path)]),
  ))
    .filter(([, resolved]) => resolved)
    .map(([path]) => path);
  const runtime = {
    resolver: JSON.stringify({
      aliases: flecks.resolver.aliases,
      fallbacks: flecks.resolver.fallbacks,
    }),
    config: JSON.stringify(flecks.config),
    loadFlecks: [
      'async () => (',
      '  Object.fromEntries(',
      '    (await Promise.all(',
      '      [',
      ...resolvedPaths.map((path) => [
        '        (async () => {',
        '          try {',
        `            return ['${path}', await import('${path}')];`,
        '          }',
        '          catch (error) {',
        '            if (!error.message.startsWith("Cannot find module")) {',
        '              throw error;',
        '            }',
        '          }',
        '        })(),',
      ]).flat(),
      '      ],',
      '    ))',
      '      .filter((entry) => entry),',
      '  )',
      ')',
    ].join('\n'),
    stubs: (
      JSON.stringify(flecks.stubs.map((stub) => (
        stub instanceof RegExp ? [stub.source, stub.flags] : stub
      )))
    ),
    ...await flecks.invokeAsync('@flecks/server.runtime'),
  };
  const runtimeString = `{${
    Object.entries(runtime)
      .map(([key, value]) => `"${key}": ${value}`).join(', ')
  }}`;
  const source = [
    "process.env.FLECKS_CORE_BUILD_TARGET = 'server';",
    `module.exports = (async () => (${runtimeString}))();`,
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
      test: runtimePath,
      use: [
        {
          loader: runtimePath,
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
  config.resolve.alias['@flecks/server/runtime$'] = runtimePath;
  Object.entries(flecks.resolver.aliases).forEach(([path, request]) => {
    debug('server runtime de-externalized %s, alias: %s', path, request);
    allowlist.push(new RegExp(`^${path}`));
  });
  // Stubs.
  flecks.stubs.forEach((stub) => {
    config.resolve.alias[stub] = false;
  });
  await flecks.runtimeCompiler('server', config);
  // Rewrite to signals for HMR.
  if ('production' !== argv.mode) {
    allowlist.push(/^webpack\/hot\/signal/);
  }
  // Externalize the rest.
  config.externals = externals({allowlist});
};
