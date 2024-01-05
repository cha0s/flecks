import createIntercom from './create-intercom';
import SocketServer from './server';

const flecksServers = new WeakMap();

export const server = (flecks) => flecksServers.get(flecks);

export const hooks = {
  '@flecks/web/server.request.socket': (flecks) => (req, res, next) => {
    req.intercom = createIntercom(server(flecks), 'web');
    next();
  },
  '@flecks/web/server.up': async (httpServer, flecks) => {
    const server = new SocketServer(httpServer, flecks);
    flecksServers.set(flecks, server);
    await server.connect();
  },
  '@flecks/repl.context': (flecks) => ({
    Packets: flecks.get('$flecks/socket.packets'),
    socketServer: server(flecks),
  }),
  '@flecks/socket.server': ({config: {'@flecks/core': {id}}}) => ({
    path: `/${id}/socket.io`,
  }),
};
