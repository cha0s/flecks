const {access, readFile, realpath} = require('fs/promises');
const {
  basename,
  dirname,
  extname,
  join,
} = require('path');

const {D} = require('@flecks/core');
const {Flecks, glob, require: R} = require('@flecks/core/server');

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
      rootMap[fleck] = webFlecks.root(fleck);
    });
  const styles = (
    await Promise.all(
      Object.entries(rootMap)
        .map(async ([fleck, root]) => {
          // Compiled? It will be included with the compilation.
          if (webFlecks.fleckIsCompiled(fleck)) {
            return undefined;
          }
          const fleckResolved = R.resolve(fleck);
          const rootResolved = dirname(R.resolve(join(root, 'package.json')));
          const sub = fleckResolved.slice(rootResolved.length + 1);
          const style = join(rootResolved, 'assets', `${basename(sub, extname(sub))}.css`);
          try {
            await access(style);
            return style;
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
  config.entry.index.push(...styles);
  // Tests.
  if (!isProduction) {
    // const testPaths = [];
    const roots = Array.from(new Set(Object.entries(rootMap).map(([root]) => root)));
    const testEntries = await Promise.all(
      roots.map(async (root) => {
        const paths = [];
        const resolved = dirname(__non_webpack_require__.resolve(root));
        const rootTests = await glob(join(resolved, 'test', '*.js'));
        paths.push(...rootTests);
        const platformTests = await Promise.all(
          webFlecks.platforms.map((platform) => (
            glob(join(resolved, 'test', 'platforms', platform, '*.js'))
          )),
        );
        paths.push(...platformTests.flat());
        return [root, paths];
      }),
    );
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
              "  await import('@flecks/web/tests');",
              testEntries
                .filter(([, paths]) => paths.length > 0)
                .map(([root, paths]) => (
                  [
                    `  describe('${root}', () => {`,
                    `    ${paths.map((path) => `require('${path}');`).join('\n    ')}`,
                    '  });',
                  ].join('\n')
                )).join('\n\n'),
            ),
          },
        },
      ],
    });
  }
};
