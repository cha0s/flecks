import commands from './commands';

export const hooks = {
  '@flecks/core.commands': commands,
  '@flecks/core.config': () => ({
    /**
     * Webpack stats configuration when building fleck target.
     */
    stats: {
      children: false,
      chunks: false,
      colors: true,
      modules: false,
    },
  }),
  '@flecks/core.targets': () => ['fleck'],
};
