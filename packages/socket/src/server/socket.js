import {promisify} from 'util';

import {compose, D, EventEmitter} from '@flecks/core';

import Socket from '../socket';

const debug = D('@flecks/socket/server/socket');

const decorate = compose(
  EventEmitter,
);

export default class ServerSocket extends decorate(Socket) {

  constructor(flecks, socket) {
    super();
    this.flecks = flecks;
    this.socket = socket;
    this.socket.emitPromise = promisify(this.socket.emit.bind(this.socket));
    [
      'disconnect',
      'disconnecting',
    ].forEach((type) => this.socket.on(type, (...args) => {
      debug(type, ...args);
      this.emit(type, ...args);
    }));
  }

  disconnect() {
    this.socket.disconnect(true);
  }

  leave(channel) {
    debug('@flecks/socket.s left %s', this.socket.id, channel);
    return this.socket.leave(channel);
  }

  async join(channel) {
    debug('@flecks/socket.s joined %s', this.socket.id, channel);
    await this.socket.join(channel);
  }

  get req() {
    return this.socket.handshake;
  }

  get rooms() {
    return Array.from(this.socket.rooms.keys());
  }

}
