export const hooks = {
  /**
   * Modify Socket.io client configuration.
   *
   * See: https://socket.io/docs/v4/client-options/
   * @invoke MergeAsync
   */
  '@flecks/socket.client': () => ({
    timeout: Infinity,
  }),

  /**
   * Define server-side intercom channels.
   * @invoke Async
   */
  '@flecks/socket.intercom': (req) => ({
    // Assuming `@my/fleck` implemented this hook, this could be called like:
    // `const result = await req.intercom('@my/fleck.key', payload)`.
    // `result` will be an `n`-length array, where `n` is the number of server instances. Each
    // element in the array will be the result of `someServiceSpecificInformation()` running
    // against that server instance.
    key: async (payload, server) => {
      return someServiceSpecificInformation();
    },
  }),

  /**
   * Gather socket packets.
   *
   * See: [the Gathering guide](../gathering).
   * @invoke MergeAsync
   */
  '@flecks/socket.packets': Flecks.provide(require.context('./packets', false, /\.js$/)),

  /**
   * Decorate socket packets.
   *
   * See: [the Gathering guide](../gathering).
   *
   * @param {constructor} Packet The packet to decorate.
   * @invoke ComposedAsync
   */
  '@flecks/socket.packets.decorate': (
    Flecks.decorate(require.context('./packets/decorators', false, /\.js$/))
  ),

  /**
   * Modify Socket.io server configuration.
   *
   * See: https://socket.io/docs/v4/server-options/
   * @invoke MergeAsync
   */
  '@flecks/socket.server': () => ({
    pingTimeout: Infinity,
  }),

  /**
   * Do something with a connecting socket.
   *
   * @param {[ServerSocket](https://github.com/cha0s/flecks/blob/master/packages/socket/src/server/socket.js)} socket The connecting socket.
   * @invoke SequentialAsync
   */
  '@flecks/socket/server.connect': (socket) => {
    socket.on('disconnect', () => {
      // ...
    });
  },

  /**
   * Do something with the Socket.IO instance.
   *
   * See: https://socket.io/docs/v4/server-instance/
   * @param {SocketIo} io The Socket.IO server instance.
   * @invoke SequentialAsync
   */
  '@flecks/socket/server.io': (io) => {
    io.engine.on("headers", (headers, req) => {
      headers["test"] = "789";
    });
  },

  /**
   * Define middleware to run when a socket connection is established.
   * @invoke Middleware
   */
  '@flecks/socket/server.request.socket': () => (socket, next) => {
    // Express-style route middleware...
    next();
  },

};

