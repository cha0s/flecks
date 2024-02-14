import {Flecks} from '@flecks/core';

export {
  DataTypes as Types,
  Op,
  default as Sequelize,
  Transaction,
} from 'sequelize';

export {default as Model} from './model';

export const hooks = Flecks.hooks(require.context('./hooks'));

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
