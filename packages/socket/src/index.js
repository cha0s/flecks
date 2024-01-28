import badPacketsCheck from './packet/bad-packets-check';
import Bundle from './packet/bundle';
import Redirect from './packet/redirect';
import Refresh from './packet/refresh';

export {default as normalize} from './normalize';
export * from './hooks';
export {Packet, Packer, ValidationError} from './packet';

export const hooks = {
  '@flecks/core.gathered': () => ({
    packets: {
      check: badPacketsCheck,
    },
  }),
  '@flecks/socket.packets': (flecks) => ({
    Bundle: Bundle(flecks),
    Redirect,
    Refresh,
  }),
  '@flecks/web.config': async (req, flecks) => ({
    'packets.decorate': (
      flecks.get('@flecks/socket.packets.decorate', ['...'])
        .filter((decorator) => 'server' !== decorator.split('/').pop())
    ),
  }),
};

export const mixin = (Flecks) => class FlecksWithSocket extends Flecks {

  constructor(runtime) {
    super(runtime);
    if (!this.socket) {
      this.socket = {};
    }
    Object.defineProperty(
      this.socket,
      'Packets',
      {get: () => this.gathered('@flecks/socket.packets')},
    );
  }

};
