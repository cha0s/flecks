import Model from '../../../src/model';

export const hooks = {
  '@flecks/db.models': () => ({
    Foo: class extends Model {},
  }),
};
