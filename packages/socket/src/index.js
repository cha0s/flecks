import badPacketsCheck from './packet/bad-packets-check';
import Bundle from './packet/bundle';
import Redirect from './packet/redirect';
import Refresh from './packet/refresh';

export {default as normalize} from './normalize';
export * from './hooks';
export {Packet, Packer, ValidationError} from './packet';

export const hooks = {
  '@flecks/core.starting': (flecks) => {
    flecks.socket.Packets = flecks.gather('@flecks/socket.packets', {check: badPacketsCheck});
  },
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

  constructor(...args) {
    super(...args);
    if (!this.socket) {
      this.socket = {};
    }
    this.socket.Packets = {};
  }

};
