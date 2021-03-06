import {Hooks} from '@flecks/core';

import {createDatabaseConnection} from './connection';
import containers from './containers';

export {DataTypes as Types, Op, default as Sequelize} from 'sequelize';

export {default as Model} from './model';

export {createDatabaseConnection};

export default {
  [Hooks]: {
    '@flecks/core.config': () => ({
      /**
       * The database to connect to.
       */
      database: ':memory:',
      /**
       * SQL dialect.
       *
       * See: https://sequelize.org/v5/manual/dialects.html
       */
      dialect: 'sqlite',
      /**
       * Database server host.
       */
      host: undefined,
      /**
       * Database server password.
       */
      password: undefined,
      /**
       * Database server port.
       */
      port: undefined,
      /**
       * Database server username.
       */
      username: undefined,
    }),
    '@flecks/core.starting': (flecks) => {
      flecks.set('$flecks/db.models', flecks.gather(
        '@flecks/db/server.models',
        {typeAttribute: 'name'},
      ));
    },
    '@flecks/docker.containers': containers,
    '@flecks/server.up': async (flecks) => {
      flecks.set('$flecks/db/sequelize', await createDatabaseConnection(flecks));
    },
    '@flecks/repl.context': (flecks) => ({
      Models: flecks.get('$flecks/db.models'),
      sequelize: flecks.get('$flecks/db/sequelize'),
    }),
  },
};
