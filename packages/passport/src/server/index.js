import {D, Flecks} from '@flecks/core';
import passport from 'passport';

const debug = D('@flecks/passport');
const debugSilly = debug.extend('silly');

export const hooks = {
  '@flecks/core.config': () => ({
    /**
     * Path to redirect to after failed login.
     */
    failureRedirect: '/',
    /**
     * Path to redirect to after logout.
     */
    logoutRedirect: '/',
    /**
     * Path to redirect to after successful login.
     */
    successRedirect: '/',
  }),
  '@flecks/db/server.models': Flecks.provide(require.context('./models')),
  '@flecks/socket.packets.decorate': Flecks.decorate(require.context('./packets/decorators')),
  '@flecks/web/server.request.route': Flecks.priority(
    (flecks) => (req, res, next) => {
      flecks.passport.initialize(req, res, () => {
        debugSilly('@flecks/web/server.request.route: passport.session()');
        flecks.passport.session(req, res, () => {
          if (!req.user) {
            const {User} = flecks.db.Models;
            req.user = new User();
            req.user.id = 0;
          }
          else {
            debugSilly('web user ID: %s', req.user.id);
          }
          next();
        });
      });
    },
    {after: '@flecks/session/server', before: '@flecks/redux/server'},
  ),
  '@flecks/server.up': Flecks.priority(
    async (flecks) => {
      passport.serializeUser((user, fn) => fn(null, user.id));
      passport.deserializeUser(async (id, fn) => {
        const {User} = flecks.db.Models;
        try {
          fn(undefined, await User.findByPk(id));
        }
        catch (error) {
          fn(error);
        }
      });
      flecks.passport = {
        initialize: passport.initialize(),
        session: passport.session(),
        strategies: flecks.invokeMergeUnique('@flecks/passport.strategies', passport),
      };
      Object.entries(flecks.passport.strategies)
        .forEach(([name, strategy]) => {
          passport.use(name, strategy);
        });
    },
    {before: '@flecks/web/server', after: ['@flecks/db/server', '@flecks/session/server']},
  ),
  '@flecks/socket.intercom': () => ({
    '@flecks/passport.users': async (sids, server) => {
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
  '@flecks/socket/server.request.socket': Flecks.priority(
    (flecks) => (socket, next) => {
      const {handshake: req} = socket;
      flecks.passport.initialize(req, undefined, () => {
        flecks.passport.session(req, undefined, async () => {
          if (!req.user) {
            const {User} = flecks.db.Models;
            req.user = new User();
            req.user.id = 0;
          }
          else {
            debugSilly('socket user ID: %s', req.user.id);
          }
          await socket.join(`/u/${req.user.id}`);
          next();
        });
      });
    },
    {after: '@flecks/session/server', before: '@flecks/governor/server'},
  ),
  '@flecks/web.routes': (flecks) => {
    const {
      failureRedirect,
      logoutRedirect,
      successRedirect,
    } = flecks.get('@flecks/passport/server');
    const routes = [
      {
        method: 'get',
        path: '/auth/logout',
        middleware: (req, res) => {
          req.logout();
          res.redirect(logoutRedirect);
        },
      },
    ];
    Object.entries(flecks.passport.strategies)
      .forEach(([name]) => {
        routes.push(
          {
            method: 'post',
            path: `/auth/${name}`,
            middleware: passport.authenticate(name, {failureRedirect, successRedirect}),
          },
        );
      });
    return routes;
  },
};

export const mixin = (Flecks) => class FlecksWithSession extends Flecks {

  passport;

};
