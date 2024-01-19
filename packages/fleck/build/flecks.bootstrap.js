const {join} = require('path');

const {glob} = require('@flecks/core/server');

const commands = require('./commands');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

exports.hooks = {
  '@flecks/core.commands': commands,
  '@flecks/core.config': () => ({
    /**
     * Webpack stats configuration.
     */
    stats: {
      colors: true,
      errorDetails: true,
    },
  }),
  '@flecks/core.targets': () => ['fleck'],
  '@flecks/fleck.processAssets': async (assets, compilation, flecks) => {
    const {RawSource} = compilation.compiler.webpack.sources;
    const packageJson = assets['package.json'];
    const json = JSON.parse(packageJson.source().toString());
    const {files} = json;
    // Add defaults.
    files.push('build');
    // Add source if it exists.
    if ((await glob(join(FLECKS_CORE_ROOT, 'src/**/*.js'))).length > 0) {
      files.push('src');
    }
    // Add tests if they exist.
    const testFiles = await glob(join(FLECKS_CORE_ROOT, 'test/**/*.js'));
    if (testFiles.length > 0) {
      files.push('test');
    }
    // Let others have a say.
    await flecks.invokeSequentialAsync('@flecks/fleck.packageJson', json, compilation);
    // Add any sourcemaps.
    json.files = json.files
      .map((filename) => {
        const maybeWithMap = [filename];
        if (compilation.assets[`${filename}.map`]) {
          maybeWithMap.push(`${filename}.map`);
        }
        return maybeWithMap;
      })
      .flat();
    // Sort and uniquify.
    json.files = [...new Set(json.files.sort((l, r) => (l < r ? -1 : 1)))];
    compilation.updateAsset('package.json', new RawSource(JSON.stringify(json, null, 2)));
  },
};
