import SocketClient from './socket';

export const hooks = {
  '@flecks/web/client.up': (flecks) => {
    const socket = new SocketClient(flecks);
    flecks.set('$flecks/socket.socket', socket);
    socket.connect();
    socket.listen();
  },
  '@flecks/socket.client': ({config: {'@flecks/core': {id}}}) => ({
    cors: {
      origin: false,
    },
    path: `/${id}/socket.io`,
  }),
};
