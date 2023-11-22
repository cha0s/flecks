import commands from './commands';

export const hooks = {
  '@flecks/core.commands': commands,
  '@flecks/core.config': () => ({
    /**
     * Webpack stats configuration when building fleck target.
     */
    stats: {
      assetsSort: 'name',
      assetsSpace: Infinity,
      children: false,
      colors: true,
      excludeAssets: [/^(?:build|src|test)\//],
      groupAssetsByChunk: false,
      groupAssetsByEmitStatus: false,
      groupAssetsByExtension: false,
      groupAssetsByInfo: false,
      groupAssetsByPath: false,
      modules: false,
    },
  }),
  '@flecks/core.targets': () => ['fleck'],
};
