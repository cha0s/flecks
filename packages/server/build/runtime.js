const {join} = require('path');

const {version} = require('../package.json');

async function runtimeModule(compilation, flecks) {
  const {compiler} = compilation;
  // Inject flecks configuration.
  const paths = Object.keys(flecks.flecks);
  const resolvedPaths = (await Promise.all(
    paths.map(async (path) => [path, await flecks.resolver.resolve(path)]),
  ))
    .filter(([, resolved]) => resolved)
    .map(([path]) => path);
  const ymlPath = join(flecks.root, 'build', 'flecks.yml');
  const runtime = {
    /* eslint-disable indent */
    bootstrappedConfig: JSON.stringify(flecks.invoke('@flecks/core.config')),
    config: (`
      Flecks.environmentConfiguration(
        ${JSON.stringify(paths)},
        Flecks.dealiasedConfig(${
          'production' === compiler.options.mode
            ? JSON.stringify(flecks.originalConfig)
            : `require('${ymlPath}').default`
        }),
      )
    `),
    /* eslint-enable indent */
    loadFlecks: [
      'async () => (',
      '  Object.fromEntries(',
      '    (await Promise.all(',
      '      [',
      ...resolvedPaths.map((path) => [
        '        (async () => {',
        '          try {',
        `            const M = await import('${path}');`,
        '            if (module.hot) {',
        // Hooks for each fleck.
        `              module.hot.accept('${path}', async () => {`,
        `                const M = require('${path}')`,
        '                try {',
        `                  global.flecks.refresh('${path}', M);`,
        '                }',
        '                catch (error) {',
        // eslint-disable-next-line no-template-curly-in-string
        '                  console.error(`HMR failed for fleck: ${error.message}`);',
        '                  module.hot.invalidate();',
        '                }',
        '              });',
        '            }',
        `            return ['${path}', M];`,
        '          }',
        '          catch (error) {',
        `            if (!error.message.startsWith("Cannot find module '${path}'")) {`,
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
    version: JSON.stringify(version),
    ...await flecks.invokeAsync('@flecks/server.runtime'),
  };
  const renderedRuntime = `{${
    Object.entries(runtime)
      .map(([key, value]) => `"${key}": ${value}`).join(', ')
  }}`;
  const source = [
    "const {Flecks} = require('@flecks/core');",
    "process.env.FLECKS_CORE_BUILD_TARGET = 'server';",
    `module.exports = (async () => (${renderedRuntime}))();`,
    // HMR.
    'if (module.hot) {',
    `  module.hot.accept('${ymlPath}', () => {`,
    `    const M = require('${ymlPath}').default;`,
    '    try {',
    `      global.flecks.invokeSequential('@flecks/core.hmr', '${ymlPath}', M);`,
    '    }',
    '    catch (error) {',
    // eslint-disable-next-line no-template-curly-in-string
    '      console.error(`flecks.reload() failed: ${error.message}`);',
    '      module.hot.invalidate();',
    '    }',
    '  });',
    // Keep HMR junk out of our output path.
    '  const {glob} = require("glob");',
    '  const {join} = require("path");',
    '  const {unlink} = require("fs/promises");',
    '  let previousHash = __webpack_hash__;',
    '  module.hot.addStatusHandler(async (status) => {',
    '    if ("idle" === status) {',
    '      const disposing = await glob(',
    `        join('${compiler.options.output.path}', \`*\${previousHash}.hot-update.*\`),`,
    '      );',
    '      await Promise.all(disposing.map((filename) => unlink(filename)));',
    '      previousHash = __webpack_hash__;',
    '    }',
    '  });',
    '}',
  ];
  // Create asset.
  return source.join('\n');
}

exports.runtimeModule = runtimeModule;
