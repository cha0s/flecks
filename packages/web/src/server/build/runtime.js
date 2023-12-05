const {readFile, realpath, stat} = require('fs/promises');
const {
  dirname,
  join,
} = require('path');

const {D} = require('@flecks/core');
const {Flecks, require: R} = require('@flecks/core/server');
const glob = require('glob');

const debug = D('@flecks/web/runtime');

module.exports = async (config, env, argv, flecks) => {
  debug('bootstrapping flecks...');
  const webFlecks = Flecks.bootstrap({
    platforms: ['client', '!server'],
  });
  debug('bootstrapped');
  const rootMap = {};
  Object.keys(webFlecks.resolver)
    .forEach((fleck) => {
      rootMap[webFlecks.root(fleck)] = fleck;
    });
  const roots = Object.entries(rootMap)
    .map(([root, fleck]) => (
      [fleck, dirname(R.resolve(join(root, 'package.json')))]
    ));
  const styles = (
    await Promise.all(
      roots
        .map(([, path]) => {
          try {
            const {files} = R(join(path, 'package.json'));
            return (
              files
                .filter((name) => name.match(/\.css$/))
                .map((name) => join(path, name))
            );
          }
          catch (error) {
            return [];
          }
        })
        .flat()
        .map(async (filename) => {
          try {
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
  const runtime = await realpath(R.resolve(join(webFlecks.resolve('@flecks/web'), 'runtime')));
  const {resolver} = webFlecks;
  const isProduction = 'production' === argv.mode;
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
  config.module.rules.push({
    test: runtime,
    use: [
      {
        loader: runtime,
        options: {
          source: source.join('\n'),
        },
      },
    ],
  });
  config.resolve.alias['@flecks/web/runtime$'] = runtime;
  flecks.runtimeCompiler(webFlecks.resolver, 'web', config);
  // Aliases.
  const aliases = webFlecks.aliases();
  if (Object.keys(aliases).length > 0) {
    Object.entries(aliases)
      .forEach(([from, to]) => {
        config.resolve.alias[from] = to;
      });
  }
  // Styles.
  // @todo Not necessary for compiled flecks.
  config.entry.index.push(...styles);
  // Tests.
  if (!isProduction) {
    const testPaths = [];
    roots.forEach(([fleck, root]) => {
      testPaths.push(...(
        glob.sync(join(root, 'test/*.js'))
          .map((path) => [fleck, path])
      ));
      for (let i = 0; i < webFlecks.platforms.length; ++i) {
        testPaths.push(
          ...(
            glob.sync(join(root, `test/platforms/${webFlecks.platforms[i]}/*.js`))
              .map((path) => [fleck, path])
          ),
        );
      }
    });
    const tests = await realpath(R.resolve(
      join(webFlecks.resolve('@flecks/web'), 'server', 'build', 'tests'),
    ));
    const testsSource = (await readFile(tests)).toString();
    config.module.rules.push({
      test: tests,
      use: [
        {
          loader: runtime,
          options: {
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
          },
        },
      ],
    });
  }
};
