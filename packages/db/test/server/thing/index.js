import Model from '@flecks/db/server/model';

export const hooks = {
  '@flecks/db.models': () => ({
    Foo: class extends Model {},
  }),
};
