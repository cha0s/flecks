import commands from './commands';
import {createReplServer} from './repl';

export const hooks = {
  '@flecks/core.commands': commands,
  '@flecks/server.up': (flecks) => createReplServer(flecks),
};
