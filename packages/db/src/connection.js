import {ByType, D} from '@flecks/core';
import Sequelize from 'sequelize';

import register from './register';

const debug = D('@flecks/db/server/connection');

export async function createDatabaseConnection(flecks) {
  let config = {};
  const {
    dialect,
    username,
    password,
    host,
    port,
    database,
  } = flecks.get('@flecks/db/server');
  if ('sqlite' === dialect) {
    config = {
      dialect: 'sqlite',
      storage: database,
    };
  }
  else {
    config = {
      dialect,
      username,
      password,
      host,
      port,
      database,
    };
  }
  debug('config: %O', {...config, ...(config.password ? {password: '*** REDACTED ***'} : {})});
  const sequelize = new Sequelize({
    logging: false,
    ...config,
  });
  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      // eslint-disable-next-line no-await-in-loop
      await sequelize.authenticate();
      break;
    }
    catch (error) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        setTimeout(resolve, 250);
      });
    }
  }
  const Models = flecks.db.Models[ByType];
  await register(Models, sequelize);
  debug('synchronizing...');
  await sequelize.sync();
  debug('synchronized');
  return sequelize;
}

export function destroyDatabaseConnection(databaseConnection) {
  if (!databaseConnection) {
    return undefined;
  }
  return databaseConnection.close();
}
