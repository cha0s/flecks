export const hooks = {
  /**
   * Define sequential actions to run when the client comes up.
   *
   * @param {Element} container The root DOM element of the application.
   *
   * @invoke SequentialAsync
   */
  '@flecks/web/client.up': async (container) => {
    await youCanDoAsyncThingsHere();
  },
  /**
   * Send configuration to clients.
   * @param {http.ClientRequest} req The HTTP request object.
   * @invoke Async
   */
  '@flecks/web.config': (req) => ({
    someConfig: req.someConfig,
  }),
  /**
   * Define HTTP routes.
   * @invoke Async
   */
  '@flecks/web.routes': () => [
    {
      method: 'get',
      path: '/some-path',
      middleware: (req, res, next) => {
        // Express-style route middleware...
        next();
      },
    },
  ],
  /**
   * Define middleware to run when a route is matched.
   * @invoke Middleware
   */
  '@flecks/web/server.request.route': () => (req, res, next) => {
    // Express-style route middleware...
    next();
  },
  /**
   * Define middleware to run when an HTTP socket connection is established.
   * @invoke Middleware
   */
  '@flecks/web/server.request.socket': () => (req, res, next) => {
    // Express-style route middleware...
    next();
  },
  /**
   * Define composition functions to run over the HTML stream prepared for the client.
   * @param {stream.Readable} stream The HTML stream.
   * @param {http.ClientRequest} req The HTTP request object.
   * @invoke ComposedAsync
   */
  '@flecks/web/server.stream.html': (stream, req) => {
    return stream.pipe(myTransformStream);
  },
  /**
   * Define sequential actions to run when the HTTP server comes up.
   * @invoke SequentialAsync
   */
  '@flecks/web/server.up': async () => {
    await youCanDoAsyncThingsHere();
  },
};
