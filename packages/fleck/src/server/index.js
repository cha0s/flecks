import {Hooks} from '@flecks/core';

import commands from './commands';

export default {
  [Hooks]: {
    '@flecks/core.commands': commands,
    '@flecks/core.config': () => ({
      /**
       * Webpack stats configuration when building fleck target.
       */
      stats: {
        chunks: false,
        colors: true,
        modules: false,
      },
    }),
    '@flecks/core.targets': () => ['fleck'],
  },
};
