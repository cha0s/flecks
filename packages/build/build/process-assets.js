const {join} = require('path');

const {glob} = require('glob');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

exports.ProcessAssets = class ProcessAssets {

  constructor(target, flecks) {
    this.flecks = flecks;
    this.target = target;
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap('@flecks/build.process-assets', (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: '@flecks/build.process-assets',
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_REPORT,
        },
        async (assets, callback) => {
          await this.flecks.invokeSequentialAsync(
            '@flecks/build.processAssets',
            this.target,
            assets,
            compilation,
          );
          callback();
        },
      );
    });
  }

};

exports.processFleckAssets = async (assets, compilation, jsonCallback) => {
  const {RawSource} = compilation.compiler.webpack.sources;
  const packageJson = assets['package.json'];
  const json = JSON.parse(packageJson.source().toString());
  const {files = []} = json;
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
  if (jsonCallback) {
    await jsonCallback(json, compilation);
  }
  // Add any sourcemaps.
  json.files = files
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
};
