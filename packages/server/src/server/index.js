import {Flecks} from '@flecks/core';

export const hooks = Flecks.hooks(require.context('./hooks'));

export const mixin = (Flecks) => class FlecksWithServer extends Flecks {

  constructor(runtime) {
    super(runtime);
    this.server = {};
  }

};
