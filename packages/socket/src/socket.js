import {ByType, D} from '@flecks/core';

import normalize from './normalize';
import acceptor from './packet/acceptor';

const debug = D('@flecks/socket');

export default class Socket {

  get id() {
    return this.socket.id;
  }

  listen() {
    const Packets = Object.entries(this.flecks.get('$flecks/socket.packets')[ByType]);
    for (let i = 0; i < Packets.length; i++) {
      const [type, Packet] = Packets[i];
      this.socket.on(Packet.id, (data, fn) => {
        const packet = new Packet(Packet.decode(Buffer.from(data)));
        debug('received packet %s(%j)', type, data);
        this.emit('packet', packet, fn);
      });
    }
    this.on('packet', acceptor(this));
  }

  static send(flecks, socket, packetOrDehydrated, method) {
    const packet = normalize(flecks, packetOrDehydrated);
    const {constructor: Packet} = packet;
    debug('sending packet %s(%j)', Packet.type, packet.data);
    try {
      return socket[method](Packet.id, Packet.encode(packet.data));
    }
    catch (error) {
      throw new Error(`${error.message}, data: ${JSON.stringify(packet.data, null, 2)}`);
    }
  }

  send(packet) {
    return this.constructor.send(this.flecks, this.socket, packet, 'emitPromise');
  }

  to(room) {
    return {
      send: (packet) => this.constructor.send(this.flecks, this.socket.to(room), packet, 'emit'),
    };
  }

}
