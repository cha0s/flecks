import D from 'debug';

const {
  NODE_ENV,
} = process.env;

const debug = D('@flecks/socket/acceptor');

export default (socket) => async (packet, fn) => {
  const Packet = packet.constructor;
  try {
    await Packet.validate(packet, socket);
    const response = await Packet.respond(packet, socket);
    if ('undefined' !== typeof response) {
      fn(undefined, response);
    }
  }
  catch (error) {
    if (error.payload) {
      fn(error.payload);
      return;
    }
    debug('acceptor error: %O', error);
    if (error instanceof Error) {
      fn({
        code: error.code || 500,
        reason: 'production' === NODE_ENV ? 'error' : error.message,
        ...('production' === NODE_ENV ? {} : {stack: error.stack}),
      });
      return;
    }
    fn(error);
  }
};
