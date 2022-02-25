const {realpathSync} = require('fs');
const {join} = require('path');

const {require: R} = require('@flecks/core/server');

module.exports = (flecks) => (neutrino) => {
  const {config, resolver} = flecks;
  // Inject flecks configuration.
  const paths = Object.keys(resolver);
  const source = [
    "process.env.FLECKS_BUILD_TARGET = 'server';",
    'module.exports = (async () => ({',
    `  config: ${JSON.stringify(config)},`,
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
  source.push(`        join('${neutrino.options.output}', \`*\${previousHash}.hot-update.*\`),`);
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
    source.push(`  module.hot.accept('${path}', () => {`);
    source.push(`    global.flecks.refresh('${path}', require('${path}'));`);
    source.push(`    global.flecks.invoke('@flecks/core/hmr', '${path}');`);
    source.push('  });');
  });
  source.push('}');
  // Create runtime.
  const entries = neutrino.config.entry('index');
  const runtime = realpathSync(R.resolve(join(flecks.resolve('@flecks/server'), 'runtime')));
  neutrino.config.module
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
  neutrino.config.resolve.alias
    .set('@flecks/server/runtime$', runtime);
  flecks.runtimeCompiler('server', neutrino, allowlist);
  // Rewrite to signals for HMR.
  if ('production' !== neutrino.config.get('mode')) {
    allowlist.push(/^webpack/);
    if (entries.has(`${R.resolve('webpack/hot/poll')}?1000`)) {
      entries.delete(`${R.resolve('webpack/hot/poll')}?1000`);
      entries.add('webpack/hot/signal');
    }
  }
  // Externalize the rest.
  const nodeExternals = R('webpack-node-externals');
  neutrino.config.externals(nodeExternals({allowlist}));
};
