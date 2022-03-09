import {Hooks} from '@flecks/core';

import commands from './commands';

export default {
  [Hooks]: {
    '@flecks/core.commands': commands,
    '@flecks/core.config': () => ({
      /**
       * Rewrite the output filenames of source files.
       *
       * `filename.replace(new RegExp([key]), [value]);`
       */
      filenameRewriters: {},
    }),
  },
};
