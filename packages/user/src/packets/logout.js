export default (flecks) => {
  const {Packet, ValidationError} = flecks.fleck('@flecks/socket');

  return class Logout extends Packet {

    static respond(packet, {req}) {
      req.logout();
      return new Promise((r, e) => {
        req.session.save((error) => (error ? e(error) : r()));
      });
    }

    static validate(packet, {req}) {
      if (!req.user) {
        throw new ValidationError({code: 400, reason: 'anonymous'});
      }
    }

  };
};
