import {randomBytes} from 'crypto';

import {Flecks} from '@flecks/core';
import LocalStrategy from 'passport-local';

export const hooks = {
  '@flecks/db/server.models.decorate': Flecks.decorate(require.context('./models/decorators')),
  '@flecks/passport.strategies': (passport, flecks) => ({
    local: new LocalStrategy(
      {usernameField: 'email'},
      async (email, password, fn) => {
        const {User} = flecks.db.Models;
        try {
          const user = await User.findOne({where: {email}});
          fn(undefined, user && await user.validatePassword(password) && user);
        }
        catch (error) {
          fn(error);
        }
      },
    ),
  }),
  '@flecks/repl.commands': (flecks) => {
    const {User} = flecks.db.Models;
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
};
