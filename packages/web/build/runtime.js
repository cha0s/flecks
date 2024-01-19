const {access, readFile} = require('fs/promises');
const {
  basename,
  dirname,
  extname,
  join,
} = require('path');

const Server = require('@flecks/core/build/server');
const {glob} = require('@flecks/core/server');

module.exports = async (config, env, argv, flecks) => {
  const buildFlecks = await Server.from({
    config: flecks.config,
    platforms: ['client', '!server'],
  });
  const {resolver, flecks: webFlecks} = buildFlecks;
  const paths = Object.keys(webFlecks)
    .filter((fleck) => !['@flecks/server'].includes(fleck));
  const styles = (
    await Promise.all(
      Object.entries(flecks.roots)
        .map(async ([fleck, {request}]) => {
          // Compiled? It will be included with the compilation.
          if (flecks.resolved[fleck]) {
            return undefined;
          }
          try {
            const fleckResolved = await resolver.resolve(fleck);
            const parentResolved = dirname(await resolver.resolve(join(request, 'package.json')));
            const sub = fleckResolved.slice(parentResolved.length + 1);
            const style = join(parentResolved, 'assets', `${basename(sub, extname(sub))}.css`);
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
  const runtime = await flecks.resolver.resolve(join('@flecks/web/runtime'));
  const isProduction = 'production' === argv.mode;
  const resolvedPaths = (await Promise.all(
    paths.map(async (path) => [path, await flecks.resolver.resolve(path)]),
  ))
    .filter(([, resolved]) => resolved)
    .map(([path]) => path);
  const source = [
    'module.exports = (update) => (async () => ({',
    "  config: window[Symbol.for('@flecks/web.config')],",
    '  flecks: Object.fromEntries(await Promise.all([',
    ...resolvedPaths
      .map((path) => [
        '    [',
        `      '${path}',`,
        `      import('${path}').then((M) => (update(${paths.length}, '${path}'), M)),`,
        '    ],',
      ]).flat(),
    '  ].map(async ([path, M]) => [path, await M]))),',
    "  platforms: ['client'],",
    '}))();',
    '',
  ];
  // HMrequire.
  source.push('if (module.hot) {');
  resolvedPaths.forEach((path) => {
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
  // Stubs.
  buildFlecks.stubs.forEach((stub) => {
    config.module.rules.push(
      {
        test: stub,
        use: 'null-loader',
      },
    );
  });
  buildFlecks.runtimeCompiler('web', config);
  // Aliases.
  Object.entries(buildFlecks.resolved)
    .forEach(([from, to]) => {
      config.resolve.alias[from] = to;
    });
  // Styles.
  config.entry.index.push(...styles);
  // Tests.
  if (!isProduction) {
    const testEntries = (await Promise.all(
      Object.entries(buildFlecks.roots)
        .map(async ([parent, {request}]) => {
          const tests = [];
          const resolved = dirname(await resolver.resolve(join(request, 'package.json')));
          const rootTests = await glob(join(resolved, 'test', '*.js'));
          tests.push(
            ...rootTests
              .map((test) => test.replace(resolved, parent)),
          );
          const platformTests = await Promise.all(
            buildFlecks.platforms.map((platform) => (
              glob(join(resolved, 'test', 'platforms', platform, '*.js'))
            )),
          );
          tests.push(
            ...platformTests
              .flat()
              .map((test) => test.replace(resolved, parent)),
          );
          return [parent, tests];
        }),
    ))
      .filter(([, tests]) => tests.length > 0);
    const tests = await resolver.resolve(
      join('@flecks/web', 'server', 'build', 'tests'),
    );
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
                .map(([root, tests]) => (
                  [
                    `  describe('${root}', () => {`,
                    `    ${tests.map((test) => `require('${test}');`).join('\n    ')}`,
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
