const {access} = require('fs/promises');
const {
  basename,
  extname,
  join,
} = require('path');

const Build = require('@flecks/build/build/build');

module.exports = async (config, env, argv, flecks) => {
  const buildFlecks = await Build.from({
    config: flecks.realiasedConfig,
    platforms: ['client', '!server'],
  });
  const {flecks: webFlecks} = buildFlecks;
  const paths = Object.keys(webFlecks)
    .filter((fleck) => !['@flecks/server'].includes(fleck));
  const styles = (
    await Promise.all(
      Object.keys(flecks.flecks)
        .map(async (fleck) => {
          // No root? How to infer?
          const [root, request] = flecks.roots.find(([root]) => fleck.startsWith(root)) || [];
          if (!root) {
            return undefined;
          }
          // Compiled? It will be included with the compilation.
          if (root !== request) {
            return undefined;
          }
          try {
            const sub = fleck.slice(root.length + 1) || 'index';
            const style = join(root, 'assets', `${basename(sub, extname(sub))}.css`);
            await access(await flecks.resolver.resolve(style));
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
  const resolvedPaths = (await Promise.all(
    paths.map(async (path) => [path, await flecks.resolver.resolve(path)]),
  ))
    .filter(([, resolved]) => resolved)
    .map(([path]) => path);
  const source = [
    'module.exports = (update) => (async () => ({',
    `  bootstrappedConfig: ${JSON.stringify(buildFlecks.invoke('@flecks/core.config'))},`,
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
    source.push(`    const M = require('${path}')`);
    source.push('    try {');
    source.push(`      global.flecks.invokeSequential('@flecks/core.hmr', '${path}', M);`);
    source.push(`      global.flecks.refresh('${path}', M);`);
    source.push('    }');
    source.push('    catch (error) {');
    // eslint-disable-next-line no-template-curly-in-string
    source.push('      console.error(`HMR failed for fleck: ${error.message}`);');
    source.push('      module.hot.invalidate();');
    source.push('    }');
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
    config.resolve.alias[stub] = false;
  });
  await buildFlecks.runtimeCompiler('web', config, env, argv);
  // Styles.
  config.entry.index.push(...styles);
};
