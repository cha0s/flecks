import createIntercom from './create-intercom';
import SocketServer from './server';

export const hooks = {
  '@flecks/web/server.request.socket': (flecks) => (req, res, next) => {
    req.intercom = createIntercom(flecks.socket.server, 'web');
    next();
  },
  '@flecks/web/server.up': async (httpServer, flecks) => {
    const server = new SocketServer(httpServer, flecks);
    flecks.socket.server = server;
    await server.connect();
  },
  '@flecks/socket.server': ({config: {'@flecks/core': {id}}}) => ({
    path: `/${id}/socket.io`,
  }),
};

export const mixin = (Flecks) => class FlecksWithSocketServer extends Flecks {

  constructor(...args) {
    super(...args);
    if (!this.socket) {
      this.socket = {};
    }
    this.socket.server = undefined;
  }

};
