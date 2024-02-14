import {Flecks} from '@flecks/core';

import {createDatabaseConnection} from '@flecks/db/server/connection';

export const hook = Flecks.priority(
  async (flecks) => {
    flecks.db.sequelize = await createDatabaseConnection(flecks);
  },
  {after: '@flecks/docker/server'},
);
