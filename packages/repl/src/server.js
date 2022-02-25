import {Hooks} from '@flecks/core';

import commands from './commands';
import {createReplServer} from './repl';

export default {
  [Hooks]: {
    '@flecks/core/commands': commands,
    '@flecks/server/up': (flecks) => createReplServer(flecks),
  },
};
