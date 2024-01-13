export default (flecks) => {
  const {Packet} = flecks.fleck('@flecks/socket');
  return class Logout extends Packet {};
};
