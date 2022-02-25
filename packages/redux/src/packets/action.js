import {compose} from '@flecks/core';

export default (flecks) => {
  const {Packer, Packet} = flecks.fleck('@flecks/socket');
  const decorate = compose(
    Packer(),
  );
  return decorate(class ActionPacket extends Packet {});
};
