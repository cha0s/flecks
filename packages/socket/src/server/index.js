import {Hooks} from '@flecks/core';

import createIntercom from './create-intercom';
import Sockets from './sockets';

export default {
  [Hooks]: {
    '@flecks/core.config': () => ({
      connect: [],
      'request.socket': [],
    }),
    '@flecks/http/server.request.socket': ({config: {'$flecks/socket.sockets': sockets}}) => (req, res, next) => {
      req.intercom = createIntercom(sockets, 'http');
      next();
    },
    '@flecks/http/server.up': async (httpServer, flecks) => {
      const sockets = new Sockets(httpServer, flecks);
      await sockets.connect();
      flecks.set('$flecks/socket.sockets', sockets);
    },
    '@flecks/repl.context': (flecks) => ({
      Packets: flecks.get('$flecks/socket.packets'),
      sockets: flecks.get('$flecks/socket.sockets'),
    }),
    '@flecks/socket.server': ({config: {'@flecks/core': {id}}}) => ({
      path: `/${id}/socket.io`,
    }),
  },
};
