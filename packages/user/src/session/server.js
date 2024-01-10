import {D, Flecks} from '@flecks/core';
import express from 'express';
import expressSession from 'express-session';

const debug = D('@flecks/user/session');
const debugSilly = debug.extend('silly');

export const hooks = {
  '@flecks/core.config': () => ({
    /**
     * Set the cookie secret for session encryption.
     *
     * See: http://expressjs.com/en/resources/middleware/cookie-parser.html
     */
    cookieSecret: (
      'Set the FLECKS_ENV__flecks_user_session_server__cookieSecret environment variable!'
    ),
  }),
  '@flecks/core.mixin': (Flecks) => (
    class FlecksWithUser extends Flecks {

      user = {
        session: undefined,
      }

    }
  ),
  '@flecks/web/server.request.route': Flecks.priority(
    (flecks) => {
      const urle = express.urlencoded({extended: true});
      return (req, res, next) => {
        debugSilly('@flecks/web/server.request.route: express.urlencoded()');
        urle(req, res, (error) => {
          if (error) {
            next(error);
            return;
          }
          debugSilly('@flecks/web/server.request.route: session()');
          flecks.user.session(req, res, (error) => {
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
    {before: '@flecks/user/server'},
  ),
  '@flecks/server.up': Flecks.priority(
    async (flecks) => {
      flecks.user.session = expressSession({
        resave: false,
        sameSite: true,
        saveUninitialized: false,
        secret: flecks.get('@flecks/user/session/server.cookieSecret'),
        ...await flecks.invokeMergeAsync('@flecks/user.session'),
      });
    },
    {after: ['@flecks/governor/server', '@flecks/user/server']},
  ),
  '@flecks/socket/server.request.socket': Flecks.priority(
    (flecks) => (socket, next) => {
      debugSilly('@flecks/socket/server.request.socket: session()');
      flecks.user.session(socket.handshake, {}, () => {
        const id = socket.handshake.session?.id;
        socket.join(id);
        next();
      });
    },
    {before: '@flecks/user/server'},
  ),
};
