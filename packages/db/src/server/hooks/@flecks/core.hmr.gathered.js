import register from '@flecks/db/server/register';

export const hook = (gathered, hook, flecks) => {
  if ('@flecks/db.models' === hook) {
    register(gathered, flecks.db.sequelize);
  }
};
