import {Flecks} from '@flecks/core';

import {createDatabaseConnection} from './connection';
import containers from './containers';
import register from './register';

export {
  DataTypes as Types,
  Op,
  default as Sequelize,
  Transaction,
} from 'sequelize';

export {default as Model} from './model';

export {createDatabaseConnection};

export const hooks = {
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
  '@flecks/core.gathered': () => ({
    models: {typeProperty: 'name'},
  }),
  '@flecks/core.hmr.gathered': (gathered, hook, flecks) => {
    if ('@flecks/db/server.models' === hook) {
      register(gathered, flecks.db.sequelize);
    }
  },
  '@flecks/docker.containers': containers,
  '@flecks/server.up': Flecks.priority(
    async (flecks) => {
      flecks.db.sequelize = await createDatabaseConnection(flecks);
    },
    {after: '@flecks/docker/server'},
  ),
};

export const mixin = (Flecks) => class FlecksWithDb extends Flecks {

  constructor(runtime) {
    super(runtime);
    if (!this.db) {
      this.db = {};
    }
    Object.defineProperty(this.db, 'Models', {get: () => this.gathered('@flecks/db/server.models')});
    let $$sequelize;
    let $$transaction = (fn) => fn();
    Object.defineProperty(
      this.db,
      'sequelize',
      {
        get: () => $$sequelize,
        set: (sequelize) => {
          $$sequelize = sequelize;
          $$transaction = sequelize.transaction.bind(sequelize);
        },
      },
    );
    Object.defineProperty(this.db, 'transaction', {get: () => $$transaction});
  }

};
