import commands from './commands';

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
};
