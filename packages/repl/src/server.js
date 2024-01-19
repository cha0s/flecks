import {createReplServer} from './repl';

export const hooks = {
  '@flecks/server.up': (flecks) => createReplServer(flecks),
};

export const mixin = (Flecks) => class FlecksWithRepl extends Flecks {

  repl;

};
