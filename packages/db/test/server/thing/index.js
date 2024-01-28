import Model from '../../../src/model';

export const hooks = {
  '@flecks/db/server.models': () => ({
    Foo: class extends Model {},
  }),
};
