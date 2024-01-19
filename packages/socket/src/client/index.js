import SocketClient from './socket';

export const hooks = {
  '@flecks/web/client.up': (flecks) => {
    const socket = new SocketClient(flecks);
    flecks.socket.client = socket;
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

export const mixin = (Flecks) => class FlecksWithSocketClient extends Flecks {

  constructor(...args) {
    super(...args);
    if (!this.socket) {
      this.socket = {};
    }
    this.socket.client = undefined;
  }

};
