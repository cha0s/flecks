import badPacketsCheck from './packet/bad-packets-check';
import Bundle from './packet/bundle';
import Redirect from './packet/redirect';
import Refresh from './packet/refresh';

export {default as normalize} from './normalize';
export * from './hooks';
export {default as Packet, Packer, ValidationError} from './packet';

export const hooks = {
  '@flecks/core.starting': (flecks) => {
    flecks.set('$flecks/socket.packets', flecks.gather(
      '@flecks/socket.packets',
      {check: badPacketsCheck},
    ));
  },
  '@flecks/web.config': async (
    req,
    {config: {'@flecks/socket': {'packets.decorate': decorators = ['...']}}},
  ) => ({
    '@flecks/socket': {
      'packets.decorate': decorators.filter(
        (decorator) => 'server' !== decorator.split('/').pop(),
      ),
    },
  }),
  '@flecks/socket.packets': (flecks) => ({
    Bundle: Bundle(flecks),
    Redirect,
    Refresh,
  }),
};
