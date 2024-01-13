import {join} from 'path';

import {glob} from '@flecks/core/server';

import commands from './commands';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

export const hooks = {
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
  '@flecks/fleck/server.processAssets': async (assets, compilation, flecks) => {
    const {RawSource} = compilation.compiler.webpack.sources;
    const packageJson = assets['package.json'];
    const json = JSON.parse(packageJson.source().toString());
    const {files} = json;
    // Add defaults.
    files.push('build', 'src');
    // Add tests if they exist.
    const testFiles = await glob(join(FLECKS_CORE_ROOT, 'test/*.js'));
    if (testFiles.length > 0) {
      files.push('test', 'test.js');
    }
    // Let others have a say.
    await flecks.invokeSequentialAsync('@flecks/fleck/server.packageJson', json, compilation);
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
