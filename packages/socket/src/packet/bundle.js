import normalize from '../normalize';
import PacketClass from './packet';

export default (flecks) => class BundlePacket extends PacketClass {

  static get data() {
    return 'buffer';
  }

  static encode(packets) {
    try {
      return this.builder.encode(this.pack(packets));
    }
    catch (error) {
      const packetTypes = packets
        .map((packet) => normalize(flecks, packet))
        .map(({constructor: {type}}) => type);
      error.message = `${this.type}(${packetTypes.join(', ')}): ${error.message}`;
      throw error;
    }
  }

  static pack(packets) {
    // Pack up all the packets.
    const packedPackets = new Array(packets.length);
    for (let i = 0; i < packets.length; i++) {
      const packet = normalize(flecks, packets[i]);
      const {constructor: Packet} = packet;
      packedPackets[i] = [Packet.id, Packet.encode(packet.data)];
    }
    // Calculate total length. All packed + 4 (uint) + 2 (ushort) for each.
    let length = 0;
    for (let i = 0; i < packedPackets.length; i++) {
      length += 4 + 2 + packedPackets[i][1].length;
    }
    // Allocate buffer.
    const buffer = Buffer.allocUnsafe(length);
    let caret = 0;
    for (let i = 0; i < packedPackets.length; i++) {
      const [id, packedPacket] = packedPackets[i];
      // Write packed length.
      buffer.writeUInt32LE(packedPacket.length, caret);
      caret += 4;
      // Write packed data.
      buffer.writeUInt16LE(id, caret);
      caret += 2;
      packedPacket.copy(buffer, caret, 0);
      caret += packedPacket.length;
    }
    return buffer;
  }

  static unpack(buffer) {
    // eslint-disable-next-line no-param-reassign
    buffer = Buffer.from(buffer);
    const res = [];
    let caret = 0;
    while (caret < buffer.length) {
      // Read packed length.
      const length = buffer.readUInt32LE(caret);
      caret += 4;
      // Read packed data. TODO: manual blitting sucks...
      const packetId = buffer.readUInt16LE(caret);
      caret += 2;
      const packedPacket = Buffer.allocUnsafe(length);
      let i = 0;
      while (i < length) {
        packedPacket.writeUInt8(buffer.readUInt8(caret++), i++);
      }
      // Lookup packet.
      const {[packetId]: Packet} = flecks.get('$flecks/socket.packets');
      res.push(new Packet(Packet.decode(packedPacket)));
    }
    return res;
  }

  static respond({data: packets}, socket) {
    for (let i = 0; i < packets.length; i++) {
      socket.emit('packet', packets[i], () => {});
    }
  }

};
