import schemapack from 'schemapack';

export default class Packet {

  constructor(data = {}) {
    this.data = data;
  }

  static get builder() {
    if (!this.$$builder) {
      this.$$builder = schemapack.build(this.data);
    }
    return this.$$builder;
  }

  static get data() {
    return {};
  }

  static decode(buffer) {
    return this.unpack(this.builder.decode(buffer));
  }

  static encode(data) {
    try {
      return this.builder.encode(this.pack(data));
    }
    catch (error) {
      throw new Error(`${this.type}: ${error.message}`);
    }
  }

  static pack(data) {
    return data;
  }

  static respond(packet, socket) {
    return packet.respond ? packet.respond(socket) : undefined;
  }

  static unpack(data) {
    return data;
  }

  static validate(packet, socket) {
    return packet.validate ? packet.validate(socket) : undefined;
  }

}
