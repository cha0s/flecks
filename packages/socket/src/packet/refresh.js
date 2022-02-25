import Packet from './packet';

export default class Refresh extends Packet {

  static respond() {
    if (window) {
      window.location.reload();
    }
  }

}
