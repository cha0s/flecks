import {D, Hooks} from '@flecks/core';
import express from 'express';
import expressSession from 'express-session';

const debug = D('@flecks/user/session');
const debugSilly = debug.extend('silly');

export default {
  [Hooks]: {
    '@flecks/core.config': () => ({
      /**
       * Set the cookie secret for session encryption.
       *
       * See: http://expressjs.com/en/resources/middleware/cookie-parser.html
       */
      cookieSecret: (
        'Set the FLECKS_ENV_FLECKS_USER_SESSION_SERVER_cookieSecret environment variable!'
      ),
    }),
    '@flecks/web/server.request.route': (flecks) => {
      const urle = express.urlencoded({extended: true});
      return (req, res, next) => {
        debugSilly('@flecks/web/server.request.route: express.urlencoded()');
        urle(req, res, (error) => {
          if (error) {
            next(error);
            return;
          }
          debugSilly('@flecks/web/server.request.route: session()');
          flecks.get('$flecks/user.session')(req, res, (error) => {
            if (error) {
              next(error);
              return;
            }
            debugSilly('session ID: %s', req.session.id);
            next();
          });
        });
      };
    },
    '@flecks/server.up': async (flecks) => {
      flecks.set('$flecks/user.session', expressSession({
        resave: false,
        sameSite: true,
        saveUninitialized: false,
        secret: flecks.get('@flecks/user/session/server.cookieSecret'),
        ...await flecks.invokeMergeAsync('@flecks/user.session'),
      }));
    },
    '@flecks/socket/server.request.socket': (flecks) => (socket, next) => {
      debugSilly('@flecks/socket/server.request.socket: session()');
      flecks.get('$flecks/user.session')(socket.handshake, {}, () => {
        const id = socket.handshake.session?.id;
        socket.join(id);
        next();
      });
    },
  },
};
