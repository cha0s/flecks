const {realpath} = require('fs/promises');
const {join} = require('path');

const {require: R} = require('@flecks/core/server');

module.exports = async (flecks) => {
  const runtime = await realpath(R.resolve(join(flecks.resolve('@flecks/server'), 'runtime')));
  return (neutrino) => {
    const {config, options} = neutrino;
    const {resolver} = flecks;
    // Inject flecks configuration.
    const paths = Object.keys(resolver);
    const source = [
      "process.env.FLECKS_CORE_BUILD_TARGET = 'server';",
      'module.exports = (async () => ({',
      `  config: ${JSON.stringify(flecks.config)},`,
      '  flecks: Object.fromEntries(await Promise.all([',
      paths.map((path) => `    ['${path}', import('${path}')]`).join(',\n'),
      '  ].map(async ([path, M]) => [path, await M]))),',
      "  platforms: ['server']",
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
    source.push(`        join('${options.output}', \`*\${previousHash}.hot-update.*\`),`);
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
    paths.forEach((path) => {
      source.push(`  module.hot.accept('${path}', async () => {`);
      source.push(`    global.flecks.refresh('${path}', require('${path}'));`);
      source.push(`    global.flecks.invoke('@flecks/core.hmr', '${path}');`);
      source.push('  });');
    });
    source.push('}');
    // Create runtime.
    config.module
      .rule(runtime)
      .test(runtime)
      .use('runtime')
      .loader(runtime)
      .options({
        source: source.join('\n'),
      });
    const allowlist = [
      '@flecks/server/entry',
      '@flecks/server/runtime',
      /^@babel\/runtime\/helpers\/esm/,
    ];
    config.resolve.alias
      .set('@flecks/server/runtime$', runtime);
    const nodeExternalsConfig = {
      additionalModuleDirs: [],
      allowlist,
    };
    flecks.runtimeCompiler(flecks.resolver, 'server', neutrino, nodeExternalsConfig);
    // Rewrite to signals for HMR.
    if ('production' !== config.get('mode')) {
      allowlist.push(/^webpack/);
    }
    // Externalize the rest.
    const nodeExternals = R('webpack-node-externals');
    config.externals(nodeExternals(nodeExternalsConfig));
  };
};
