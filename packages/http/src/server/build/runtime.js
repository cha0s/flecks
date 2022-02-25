const {realpathSync} = require('fs');
const {join} = require('path');

const {Flecks, require: R} = require('@flecks/core/server');
const D = require('debug');

const debug = D('@flecks/http/runtime');

module.exports = (flecks) => (neutrino) => {
  debug('bootstrapping flecks...');
  const httpFlecks = Flecks.bootstrap({platforms: ['client'], without: ['server']});
  debug('bootstrapped');
  const {resolver} = httpFlecks;
  const paths = Object.entries(resolver);
  const source = [
    'module.exports = (update) => (async () => ({',
    "  config: window[Symbol.for('@flecks/http/config')],",
    '  flecks: Object.fromEntries(await Promise.all([',
    paths
      .map(([path]) => [
        '    [',
        `      '${path}',`,
        `      import('${path}').then((M) => (update(${paths.length}, '${path}'), M)),`,
        '    ]',
      ].join('\n'))
      .join(',\n'),
    '  ].map(async ([path, M]) => [path, await M]))),',
    "  platforms: ['client'],",
    '}))();',
    '',
  ];
  // HMR.
  source.push('if (module.hot) {');
  paths.forEach(([path]) => {
    source.push(`  module.hot.accept('${path}', () => {`);
    source.push(`    window.flecks.refresh('${path}', require('${path}'));`);
    source.push(`    window.flecks.invoke('@flecks/core/hmr', '${path}');`);
    source.push('  });');
  });
  source.push('}');
  source.push('');
  // Create runtime.
  const runtime = realpathSync(R.resolve(join(flecks.resolve('@flecks/http'), 'runtime')));
  neutrino.config.module
    .rule(runtime)
    .test(runtime)
    .use('runtime/http')
    .loader(runtime)
    .options({
      source: source.join('\n'),
    });
  neutrino.config.resolve.alias
    .set('@flecks/http/runtime$', runtime);
  flecks.runtimeCompiler('http', neutrino);
  // Handle runtime import.
  const fullresolve = (fleck, path) => realpathSync(R.resolve(join(flecks.resolve(fleck), path)));
  const entry = fullresolve('@flecks/http', 'entry');
  neutrino.config.module
    .rule(entry)
    .test(entry)
    .use('entry/http')
    .loader(fullresolve('@flecks/http', 'import-loader'));
  // Aliases.
  const aliases = flecks.aliases();
  if (Object.keys(aliases).length > 0) {
    Object.entries(aliases)
      .forEach(([from, to]) => {
        neutrino.config.resolve.alias
          .set(from, to);
      });
  }
  // Tests.
  const testPaths = paths
    .map(([path, resolved]) => [path, join(resolved, 'test')])
    .filter(([, path]) => {
      try {
        R.resolve(path);
        return true;
      }
      catch (error) {
        return false;
      }
    });
  const tests = realpathSync(R.resolve(join(flecks.resolve('@flecks/http'), 'tests')));
  neutrino.config.module
    .rule(tests)
    .test(tests)
    .use('runtime/test')
    .loader(runtime)
    .options({
      source: testPaths.map(
        ([original, path]) => `describe('${original}', () => require('${path}'));`,
      ).join(''),
    });
};
