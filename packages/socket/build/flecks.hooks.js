export const hooks = {
  /**
   * Modify Socket.io client configuration.
   *
   * See: https://socket.io/docs/v4/client-options/
   */
  '@flecks/socket.client': () => ({
    timeout: Infinity,
  }),

  /**
   * Define server-side intercom channels.
   */
  '@flecks/socket.intercom': (req) => ({
    // This would have been called like:
    // `const result = await req.intercom('@my/fleck.key', payload)`.
    // `result` will be an `n`-length array, where `n` is the number of server instances. Each
    // element in the array will be the result of `someServiceSpecificInformation()` running
    // against that server instance.
    '@my/fleck.key': async (payload, server) => {
      return someServiceSpecificInformation();
    },
  }),

  /**
   * Define socket packets.
   *
   * In the example below, your fleck would have a `packets` subdirectory, and each
   * decorator would be defined in its own file.
   * See: https://github.com/cha0s/flecks/tree/master/packages/redux/src/packets
   *
   * See: https://github.com/cha0s/flecks/tree/master/packages/socket/src/packet/packet.js
   * See: https://github.com/cha0s/flecks/tree/master/packages/socket/src/packet/redirect.js
   */
  '@flecks/socket.packets': Flecks.provide(require.context('./packets', false, /\.js$/)),

  /**
   * Decorate database models.
   *
   * In the example below, your fleck would have a `packets/decorators` subdirectory, and each
   * decorator would be defined in its own file.
   * @param {constructor} Packet The packet to decorate.
   */
  '@flecks/socket.packets.decorate': (
    Flecks.decorate(require.context('./packets/decorators', false, /\.js$/))
  ),

  /**
   * Modify Socket.io server configuration.
   *
   * See: https://socket.io/docs/v4/server-options/
   */
  '@flecks/socket.server': () => ({
    pingTimeout: Infinity,
  }),

  /**
   * Do something with a connecting socket.
   *
   * @param {[ServerSocket](https://github.com/cha0s/flecks/blob/master/packages/socket/src/server/socket.js)} socket The connecting socket.
   */
  '@flecks/socket/server.connect': (socket) => {
    socket.on('disconnect', () => {
      // ...
    });
  },

  /**
   * Get the Socket.IO instance.
   *
   * See: https://socket.io/docs/v4/server-instance/
   * @param {SocketIo} io The Socket.IO server instance.
   */
  '@flecks/socket/server.io': (io) => {
    io.engine.on("headers", (headers, req) => {
      headers["test"] = "789";
    });
  },

  /**
   * Define middleware to run when a socket connection is established.
   */
  '@flecks/socket/server.request.socket': () => (socket, next) => {
    // Express-style route middleware...
    next();
  },

};

