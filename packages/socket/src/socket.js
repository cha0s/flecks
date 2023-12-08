import {ByType, D} from '@flecks/core';

import normalize from './normalize';
import acceptor from './packet/acceptor';

const debug = D('@flecks/socket:silly');

export default class Socket {

  get id() {
    return this.socket.id;
  }

  listen() {
    const {[ByType]: PacketsByType} = this.flecks.get('$flecks/socket.packets');
    const Packets = Object.entries(PacketsByType);
    for (let i = 0; i < Packets.length; i++) {
      const [type, Packet] = Packets[i];
      this.socket.on(Packet.id, (data, fn) => {
        // Look up again in case of HMR.
        const Packet = PacketsByType[type];
        const packet = new Packet(Packet.decode(Buffer.from(data)));
        debug('received packet %s(%j)', type, packet.data);
        this.emit('packet', packet, fn);
      });
    }
    this.on('packet', acceptor(this));
  }

  send(packetOrDehydrated) {
    const packet = normalize(this.flecks, packetOrDehydrated);
    const {constructor: Packet} = packet;
    debug('sending packet %s(%j)', Packet.type, packet.data);
    try {
      return this.socket.emitPromise(Packet.id, Packet.encode(packet.data));
    }
    catch (error) {
      throw new Error(`${error.message}, data: ${JSON.stringify(packet.data, null, 2)}`);
    }
  }

}
