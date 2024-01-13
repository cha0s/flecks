export default (Logout, flecks) => {
  const {ValidationError} = flecks.fleck('@flecks/socket');
  return class ServerLogout extends Logout {

    static async respond(packet, socket) {
      const {req} = socket;
      req.logout();
      await new Promise((r, e) => {
        req.session.save((error) => (error ? e(error) : r()));
      });
      socket.send(['Redirect', flecks.get('@flecks/passport/server.logoutRedirect')]);
    }

    static validate(packet, {req}) {
      if (!req.user) {
        throw new ValidationError({code: 400, reason: 'anonymous'});
      }
    }

  };
};
