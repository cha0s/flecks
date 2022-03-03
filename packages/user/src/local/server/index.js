import {randomBytes} from 'crypto';

import {Flecks, Hooks} from '@flecks/core';
import passport from 'passport';
import LocalStrategy from 'passport-local';

export default {
  [Hooks]: {
    '@flecks/core/config': () => ({
      failureRedirect: '/',
      successRedirect: '/',
    }),
    '@flecks/db/server/models.decorate': (
      Flecks.decorate(require.context('./models/decorators', false, /\.js$/))
    ),
    '@flecks/http/routes': (flecks) => {
      const {failureRedirect, successRedirect} = flecks.get('@flecks/user/local/server');
      return [
        {
          method: 'post',
          path: '/auth/local',
          middleware: passport.authenticate('local', {failureRedirect, successRedirect}),
        },
      ];
    },
    '@flecks/repl/commands': (flecks) => {
      const {User} = flecks.get('$flecks/db.models');
      return {
        createUser: async (spec) => {
          const [email, maybePassword] = spec.split(' ', 2);
          const password = maybePassword || randomBytes(8).toString('hex');
          const user = User.build({email});
          await user.addHashedPassword(password);
          await user.save();
        },
        resetPassword: async (email) => {
          const password = randomBytes(8).toString('hex');
          const user = await User.findOne({where: {email}});
          if (user) {
            await user.addHashedPassword(password);
            await user.save();
            return `\nNew password: ${password}\n\n`;
          }
          return 'User not found.\n';
        },
      };
    },
    '@flecks/server/up': (flecks) => {
      passport.use(new LocalStrategy(
        {usernameField: 'email'},
        async (email, password, fn) => {
          const {User} = flecks.get('$flecks/db.models');
          try {
            const user = await User.findOne({where: {email}});
            fn(undefined, user && await user.validatePassword(password) && user);
          }
          catch (error) {
            fn(error);
          }
        },
      ));
    },
  },
};
