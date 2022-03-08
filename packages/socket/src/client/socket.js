import {promisify} from 'util';

import {compose, D, EventEmitter} from '@flecks/core';
import io from 'socket.io-client';

import Socket from '../socket';

const debug = D('@flecks/socket/client/socket');

const decorate = compose(
  EventEmitter,
);

export default class SocketClient extends decorate(Socket) {

  constructor(flecks) {
    super();
    this.flecks = flecks;
    this.socket = null;
  }

  connect(address) {
    if (this.socket) {
      this.socket.destroy();
    }
    this.address = address;
    debug('connecting to %s', this.address);
    this.socket = io(
      this.address,
      {
        reconnectionDelay: 'production' === process.env.NODE_ENV ? 1000 : 100,
        reconnectionDelayMax: 'production' === process.env.NODE_ENV ? 5000 : 500,
        ...this.flecks.invokeMerge('@flecks/socket/client'),
      },
    );
    this.socket.emitPromise = promisify(this.socket.emit.bind(this.socket));
    [
      'error',
      'reconnect',
      'reconnect_attempt',
      'reconnect_error',
      'reconnect_failed',
      'ping',
    ].forEach((type) => this.socket.io.on(type, (...args) => {
      debug(type, ...args);
      this.emit(type, ...args);
    }));
    [
      'connect',
      'connect_error',
      'disconnect',
    ].forEach((type) => this.socket.on(type, (...args) => {
      debug(type, ...args);
      this.emit(type, ...args);
    }));
  }

  disconnect() {
    this.socket.disconnect();
  }

}
