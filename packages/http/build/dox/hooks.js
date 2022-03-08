import {Hooks} from '@flecks/core';

export default {
  [Hooks]: {
    /**
     * Define sequential actions to run when the client comes up.
     */
    '@flecks/http/client.up': async () => {
      await youCanDoAsyncThingsHere();
    },
    /**
     * Override flecks configuration sent to client flecks.
     * @param {http.ClientRequest} req The HTTP request object.
     */
    '@flecks/http.config': (req) => ({
      someClientFleck: {
        someConfig: req.someConfig,
      },
    }),
    /**
     * Define HTTP routes.
     */
    '@flecks/http.routes': () => [
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
     * Define neutrino compilation middleware (e.g. @neutrinojs/react).
     */
    '@flecks/http/server.compiler': () => {
      return require('@neutrinojs/node');
    },
    /**
     * Define middleware to run when a route is matched.
     */
    '@flecks/http/server.request.route': () => (req, res, next) => {
      // Express-style route middleware...
      next();
    },
    /**
     * Define middleware to run when an HTTP socket connection is established.
     */
    '@flecks/http/server.request.socket': () => (req, res, next) => {
      // Express-style route middleware...
      next();
    },
    /**
     * Define composition functions to run over the HTML stream prepared for the client.
     * @param {stream.Readable} stream The HTML stream.
     * @param {http.ClientRequest} req The HTTP request object.
     */
    '@flecks/http/server.stream.html': (stream, req) => {
      return stream.pipe(myTransformStream);
    },
    /**
     * Define sequential actions to run when the HTTP server comes up.
     */
    '@flecks/http/server.up': async () => {
      await youCanDoAsyncThingsHere();
    },
  },
};

