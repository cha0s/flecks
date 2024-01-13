import {D} from '@flecks/core';
import express from 'express';
import expressSession from 'express-session';

const debug = D('@flecks/session');
const debugSilly = debug.extend('silly');

export const hooks = {
  '@flecks/core.config': () => ({
    /**
     * Set the cookie secret for session encryption.
     *
     * See: http://expressjs.com/en/resources/middleware/cookie-parser.html
     */
    cookieSecret: (
      'Set the FLECKS_ENV__flecks_session_server__cookieSecret environment variable!'
    ),
  }),
  '@flecks/core.mixin': (Flecks) => (
    class FlecksWithSession extends Flecks {

      session;

    }
  ),
  '@flecks/web/server.request.route': (flecks) => {
    const urle = express.urlencoded({extended: true});
    return (req, res, next) => {
      urle(req, res, (error) => {
        if (error) {
          next(error);
          return;
        }
        flecks.session(req, res, (error) => {
          if (error) {
            next(error);
            return;
          }
          debugSilly('web session ID: %s', req.session.id);
          next();
        });
      });
    };
  },
  '@flecks/server.up': async (flecks) => {
    flecks.session = expressSession({
      resave: false,
      sameSite: true,
      saveUninitialized: false,
      secret: flecks.get('@flecks/session/server.cookieSecret'),
      ...await flecks.invokeMergeAsync('@flecks/session.config'),
    });
  },
  '@flecks/socket/server.request.socket': (flecks) => (socket, next) => {
    flecks.session(socket.handshake, {}, () => {
      const id = socket.handshake.session?.id;
      socket.join(id);
      debugSilly('socket session ID: %s', id);
      next();
    });
  },
};
