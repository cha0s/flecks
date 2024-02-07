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
      dealiasedConfig(${
        'production' === compiler.options.mode
          ? JSON.stringify(flecks.originalConfig)
          : `require('${ymlPath}').default`
      })
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
        `            return ['${path}', await import('${path}')];`,
        '          }',
        '          catch (error) {',
        '            if (!error.message.startsWith("Cannot find module")) {',
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
  const runtimeString = `{${
    Object.entries(runtime)
      .map(([key, value]) => `"${key}": ${value}`).join(', ')
  }}`;
  const source = [
    `const {dealiasedConfig} = {${flecks.constructor.dealiasedConfig.toString()}};`,
    "process.env.FLECKS_CORE_BUILD_TARGET = 'server';",
    `module.exports = (async () => (${runtimeString}))();`,
  ];
  // HMR.
  source.push('if (module.hot) {');
  source.push(`  module.hot.accept('${ymlPath}', async () => {`);
  source.push(`    const M = require('${ymlPath}').default;`);
  source.push('    try {');
  source.push(`      global.flecks.invokeSequential('@flecks/core.hmr', '${ymlPath}', M);`);
  source.push('    }');
  source.push('    catch (error) {');
  // eslint-disable-next-line no-template-curly-in-string
  source.push('      console.error(`flecks.reload() failed: ${error.message}`);');
  source.push('      module.hot.invalidate();');
  source.push('    }');
  source.push('  });');
  // Keep HMR junk out of our output path.
  source.push('  const {glob} = require("glob");');
  source.push('  const {join} = require("path");');
  source.push('  const {unlink} = require("fs/promises");');
  source.push('  let previousHash = __webpack_hash__;');
  source.push('  module.hot.addStatusHandler(async (status) => {');
  source.push('    if ("idle" === status) {');
  source.push('      const disposing = await glob(');
  source.push(`        join('${compiler.options.output.path}', \`*\${previousHash}.hot-update.*\`),`);
  source.push('      );');
  source.push('      await Promise.all(disposing.map((filename) => unlink(filename)));');
  source.push('      previousHash = __webpack_hash__;');
  source.push('    }');
  source.push('  });');
  // Hooks for each fleck.
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
  // Create asset.
  return source.join('\n');
}

exports.runtimeModule = runtimeModule;
