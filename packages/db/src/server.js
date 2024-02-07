import {Flecks} from '@flecks/core';

import containers from '../build/containers';
import {createDatabaseConnection} from './connection';
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
  '@flecks/core.hmr.gathered': (gathered, hook, flecks) => {
    if ('@flecks/db.models' === hook) {
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
    Object.defineProperty(this.db, 'Models', {get: () => this.gathered('@flecks/db.models')});
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
