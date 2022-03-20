const {readFile, realpath, stat} = require('fs/promises');
const {
  dirname,
  join,
} = require('path');

const {D} = require('@flecks/core');
const {Flecks, require: R} = require('@flecks/core/server');
const glob = require('glob');

const debug = D('@flecks/web/runtime');

module.exports = async (flecks) => {
  debug('bootstrapping flecks...');
  const httpFlecks = Flecks.bootstrap({
    platforms: ['client', '!server'],
  });
  debug('bootstrapped');
  const rootMap = {};
  Object.keys(httpFlecks.resolver)
    .forEach((fleck) => {
      rootMap[httpFlecks.root(fleck)] = fleck;
    });
  const roots = Object.entries(rootMap)
    .map(([root, fleck]) => (
      [fleck, dirname(R.resolve(join(root, 'package.json')))]
    ));
  const styles = (
    await Promise.all(
      roots
        .map(async ([, path]) => {
          try {
            const filename = join(path, 'index.css');
            await stat(filename);
            return filename;
          }
          catch (error) {
            return undefined;
          }
        }),
    )
  )
    .filter((filename) => !!filename);
  const runtime = await realpath(R.resolve(join(httpFlecks.resolve('@flecks/web'), 'runtime')));
  const tests = await realpath(R.resolve(
    join(httpFlecks.resolve('@flecks/web'), 'server', 'build', 'tests'),
  ));
  const testsSource = (await readFile(tests)).toString();
  return (neutrino) => {
    const {config} = neutrino;
    const {resolver} = httpFlecks;
    const isProduction = 'production' === config.get('mode');
    const paths = Object.entries(resolver);
    const source = [
      'module.exports = (update) => (async () => ({',
      "  config: window[Symbol.for('@flecks/web.config')],",
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
      source.push(`    window.flecks.invoke('@flecks/core.hmr', '${path}', updatedFleck);`);
      source.push('  });');
    });
    source.push('}');
    source.push('');
    // Create runtime.
    config.module
      .rule(runtime)
      .test(runtime)
      .use('runtime/http')
      .loader(runtime)
      .options({
        source: source.join('\n'),
      });
    config.resolve.alias
      .set('@flecks/web/runtime$', runtime);
    flecks.runtimeCompiler(httpFlecks.resolver, 'http', neutrino);
    // Aliases.
    const aliases = httpFlecks.aliases();
    if (Object.keys(aliases).length > 0) {
      Object.entries(aliases)
        .forEach(([from, to]) => {
          config.resolve.alias
            .set(from, to);
        });
    }
    // Styles.
    const entries = config.entry('index');
    styles.forEach((style) => {
      entries.add(style);
    });
    // Tests.
    if (!isProduction) {
      const testPaths = [];
      roots.forEach(([fleck, root]) => {
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
      config.module
        .rule(tests)
        .test(tests)
        .use('runtime/test')
        .loader(runtime)
        .options({
          source: testsSource.replace(
            "await import('@flecks/web/tests');",
            [
              'const tests = {};',
              Object.entries(
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
                  ([original, paths]) => (
                    [
                      `describe('${original}', () => {`,
                      `  ${paths.join('\n  ')}`,
                      '});',
                    ].join('\n')
                  ),
                ).join('\n'),
              'await Promise.all(Object.values(tests));',
            ].join('\n'),
          ),
        });
    }
  };
};
