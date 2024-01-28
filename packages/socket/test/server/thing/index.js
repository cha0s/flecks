import Packet from '../../../src/packet/packet';

export const hooks = {
  '@flecks/socket.packets': () => ({
    Foo: class extends Packet {},
  }),
};
