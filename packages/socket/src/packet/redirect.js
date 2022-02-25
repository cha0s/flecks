import Packet from './packet';

export default class Redirect extends Packet {

  static get data() {
    return 'string';
  }

  static respond(packet) {
    if ('undefined' !== typeof window) {
      window.location.href = packet.data;
    }
  }

}
