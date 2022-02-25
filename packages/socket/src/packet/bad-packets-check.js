import FlecksPacket from './packet';

export default (Packets, type) => {
  const badPackets = Object.fromEntries(
    Object.entries(Packets).filter(([, Packet]) => !(Packet instanceof FlecksPacket)),
  );
  if (badPackets.length > 0) {
    const badKeys = Object.keys(badPackets);
    throw new Error([
      `Implementations of ${type}`,
      "need to return a map of subclasses derived from '@flecks/socket/packet'. The following",
      'packets were not:',
      `'${badKeys.join("', '")}'`,
    ].join(' '));
  }
};
