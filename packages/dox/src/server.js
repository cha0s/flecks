import {Hooks} from '@flecks/core';

import commands from './commands';

export default {
  [Hooks]: {
    '@flecks/core/commands': commands,
  },
};
