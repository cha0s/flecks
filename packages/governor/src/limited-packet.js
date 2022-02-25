export default (flecks, [name, Packet]) => {
  const {ValidationError} = flecks.fleck('@flecks/socket');
  return class LimitedPacket extends Packet {

    constructor(...args) {
      super(...args);
      const {[name]: limiter} = flecks.get('$flecks/governor.packet.limiters');
      this.limit = limiter;
    }

    static async validate(packet, socket) {
      try {
        await packet.limit.consume(socket.id);
      }
      catch (error) {
        if (error.msBeforeNext) {
          throw new ValidationError({
            code: 429,
            ttr: Math.round(error.msBeforeNext / 1000) || 1,
          });
        }
        throw error;
      }
      if (super.validate) {
        await super.validate(packet, socket);
      }
    }

  };
};
