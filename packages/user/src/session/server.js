import {Hooks} from '@flecks/core';
import D from 'debug';
import express from 'express';
import expressSession from 'express-session';

const debug = D('@flecks/user/session');

const {
  FLECKS_USER_COOKIE_SECRET = 'UNSAFE_DEV_COOKIE',
} = process.env;

export default {
  [Hooks]: {
    '@flecks/http/server/request.route': (flecks) => {
      const urle = express.urlencoded({extended: true});
      return (req, res, next) => {
        debug('@flecks/http/server/request.route: express.urlencoded()');
        urle(req, res, () => {
          debug('@flecks/http/server/request.route: session()');
          flecks.get('$flecks/user.session')(req, res, (error) => {
            if (error) {
              next(error);
              return;
            }
            debug('session ID: %s', req.session.id);
            next();
          });
        });
      };
    },
    '@flecks/server/up': async (flecks) => {
      flecks.set('$flecks/user.session', expressSession({
        resave: false,
        sameSite: true,
        saveUninitialized: false,
        secret: FLECKS_USER_COOKIE_SECRET,
        ...await flecks.invokeReduceAsync('@flecks/user/session'),
      }));
    },
    '@flecks/socket/server/request.socket': (flecks) => (socket, next) => {
      debug('@flecks/socket/server/request.socket: session()');
      flecks.get('$flecks/user.session')(socket.handshake, {}, () => {
        const id = socket.handshake.session?.id;
        socket.join(id);
        next();
      });
    },
  },
};
