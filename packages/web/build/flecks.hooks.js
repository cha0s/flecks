export const hooks = {
  /**
   * Define sequential actions to run when the client comes up.
   */
  '@flecks/web/client.up': async () => {
    await youCanDoAsyncThingsHere();
  },
  /**
   * Override flecks configuration sent to client flecks.
   * @param {http.ClientRequest} req The HTTP request object.
   */
  '@flecks/web.config': (req) => ({
    someClientFleck: {
      someConfig: req.someConfig,
    },
  }),
  /**
   * Define HTTP routes.
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
   */
  '@flecks/web/server.request.route': () => (req, res, next) => {
    // Express-style route middleware...
    next();
  },
  /**
   * Define middleware to run when an HTTP socket connection is established.
   */
  '@flecks/web/server.request.socket': () => (req, res, next) => {
    // Express-style route middleware...
    next();
  },
  /**
   * Define composition functions to run over the HTML stream prepared for the client.
   * @param {stream.Readable} stream The HTML stream.
   * @param {http.ClientRequest} req The HTTP request object.
   */
  '@flecks/web/server.stream.html': (stream, req) => {
    return stream.pipe(myTransformStream);
  },
  /**
   * Define sequential actions to run when the HTTP server comes up.
   */
  '@flecks/web/server.up': async () => {
    await youCanDoAsyncThingsHere();
  },
};
