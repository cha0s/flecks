import {D, Flecks, Hooks} from '@flecks/core';
import passport from 'passport';
import LogOps from 'passport/lib/http/request';

const debug = D('@flecks/user/passport');

export default {
  [Hooks]: {
    '@flecks/db/server.models': Flecks.provide(require.context('./models', false, /\.js$/)),
    '@flecks/web/server.request.route': (flecks) => (req, res, next) => {
      debug('@flecks/web/server.request.route: passport.initialize()');
      passport.initialize()(req, res, () => {
        debug('@flecks/web/server.request.route: passport.session()');
        passport.session()(req, res, () => {
          if (!req.user) {
            const {User} = flecks.get('$flecks/db.models');
            req.user = new User();
            req.user.id = 0;
          }
          next();
        });
      });
    },
    '@flecks/web.routes': () => [
      {
        method: 'get',
        path: '/auth/logout',
        middleware: (req, res) => {
          req.logout();
          res.redirect('/');
        },
      },
    ],
    '@flecks/server.up': (flecks) => {
      passport.serializeUser((user, fn) => fn(null, user.id));
      passport.deserializeUser(async (id, fn) => {
        const {User} = flecks.get('$flecks/db.models');
        try {
          fn(undefined, await User.findByPk(id));
        }
        catch (error) {
          fn(error);
        }
      });
    },
    '@flecks/socket.intercom': () => ({
      '@flecks/user/users': async (sids, server) => {
        const sockets = await server.sockets();
        return sids
          .filter((sid) => sockets.has(sid))
          .reduce(
            (r, sid) => ({
              ...r,
              [sid]: sockets.get(sid).handshake.user.id,
            }),
            {},
          );
      },
    }),
    '@flecks/socket/server.request.socket': (flecks) => (socket, next) => {
      debug('@flecks/socket/server.request.socket: passport.initialize()');
      passport.initialize()(socket.handshake, undefined, () => {
        debug('@flecks/socket/server.request.socket: passport.session()');
        passport.session()(socket.handshake, undefined, async () => {
          /* eslint-disable no-param-reassign */
          if (!socket.handshake.user) {
            const {User} = flecks.get('$flecks/db.models');
            socket.handshake.user = new User();
            socket.handshake.user.id = 0;
          }
          socket.handshake.login = LogOps.logIn;
          socket.handshake.logIn = LogOps.logIn;
          socket.handshake.logout = LogOps.logOut;
          socket.handshake.logOut = LogOps.logOut;
          socket.handshake.isAuthenticated = LogOps.isAuthenticated;
          socket.handshake.isUnauthenticated = LogOps.isUnauthenticated;
          /* eslint-enable no-param-reassign */
          await socket.join(`/u/${socket.handshake.user.id}`);
          next();
        });
      });
    },
  },
};
