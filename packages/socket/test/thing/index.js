import Packet from '@flecks/socket/packet/packet';

export const hooks = {
  '@flecks/socket.packets': () => ({
    Foo: class extends Packet {},
  }),
};
