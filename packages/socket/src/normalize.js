const hydrate = (flecks, [type, data]) => {
  const {[type]: Packet} = flecks.get('$flecks/socket.packets');
  if (!Packet) {
    throw new TypeError(`No packet of type '${type}'`);
  }
  return new Packet(data);
};

export default (flecks, packetOrDehydrated) => (
  Array.isArray(packetOrDehydrated)
    ? hydrate(flecks, packetOrDehydrated)
    : packetOrDehydrated
);
