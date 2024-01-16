import {createReplServer} from './repl';

export const hooks = {
  '@flecks/core.mixin': (Flecks) => (
    class FlecksWithRepl extends Flecks {

      repl;

    }
  ),
  '@flecks/server.up': (flecks) => createReplServer(flecks),
};
