const {realpath} = require('fs/promises');
const {
  dirname,
  join,
} = require('path');

const {D} = require('@flecks/core');
const {Flecks, require: R} = require('@flecks/core/server');
const glob = require('glob');

const debug = D('@flecks/http/runtime');

module.exports = async (flecks) => {
  debug('bootstrapping flecks...');
  const httpFlecks = Flecks.bootstrap({platforms: ['client'], without: ['server']});
  debug('bootstrapped');
  const runtime = await realpath(R.resolve(join(flecks.resolve('@flecks/http'), 'runtime')));
  const fullresolve = (fleck, path) => realpath(R.resolve(join(flecks.resolve(fleck), path)));
  const entry = await fullresolve('@flecks/http', 'entry');
  const importLoader = await fullresolve('@flecks/http', 'import-loader');
  const tests = await realpath(R.resolve(join(flecks.resolve('@flecks/http'), 'tests')));
  return (neutrino) => {
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
      source.push(`  module.hot.accept('${path}', async () => {`);
      source.push(`    const updatedFleck = require('${path}');`);
      source.push(`    window.flecks.refresh('${path}', updatedFleck);`);
      source.push(`    window.flecks.invoke('@flecks/core/hmr', '${path}', updatedFleck);`);
      source.push('  });');
    });
    source.push('}');
    source.push('');
    // Create runtime.
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
    neutrino.config.module
      .rule(entry)
      .test(entry)
      .use('entry/http')
      .loader(importLoader);
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
    const testRoots = Array.from(new Set(
      Object.keys(httpFlecks.resolver)
        .map((fleck) => [fleck, httpFlecks.root(fleck)]),
    ))
      .map(([fleck, root]) => (
        [fleck, dirname(R.resolve(join(root, 'package.json')))]
      ));
    const testPaths = [];
    testRoots.forEach(([fleck, root]) => {
      testPaths.push(...(
        glob.sync(join(root, 'test/*.js'))
          .map((path) => [fleck, path])
      ));
      for (let i = 0; i < httpFlecks.platforms.length; ++i) {
        testPaths.push(
          ...(
            glob.sync(join(root, `test/platforms/${httpFlecks.platforms[i]}/*.js`))
              .map((path) => [fleck, path])
          ),
        );
      }
    });
    // Test entrypoint.
    if (testPaths.length > 0) {
      const testEntry = neutrino.config.entry('test').clear();
      testPaths.forEach(([, path]) => testEntry.add(path));
    }
    neutrino.config.module
      .rule(tests)
      .test(tests)
      .use('runtime/test')
      .loader(runtime)
      .options({
        source: Object.entries(
          testPaths
            .reduce(
              (r, [fleck, path]) => ({
                ...r,
                [fleck]: [...(r[fleck] || []), `require('${path}');`],
              }),
              {},
            ),
        )
          .map(
            ([original, paths]) => `describe('${original}', () => { ${paths.join(' ')} });`,
          ).join(''),
      });
  };
};
