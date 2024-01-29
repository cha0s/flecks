export const hooks = {

  /**
   * Gather database models.
   *
   * In the example below, your fleck would have a `models` subdirectory, and each model would be
   * defined in its own file.
   * See: https://github.com/cha0s/flecks/tree/master/packages/user/src/server/models
   */
  '@flecks/db.models': Flecks.provide(require.context('./models', false, /\.js$/)),

  /**
   * Decorate database models.
   *
   * In the example below, your fleck would have a `models/decorators` subdirectory, and each
   * decorator would be defined in its own file.
   * See: https://github.com/cha0s/flecks/tree/master/packages/user/src/local/server/models/decorators
   *
   * @param {constructor} Model The model to decorate.
   */
  '@flecks/db.models.decorate': (
    Flecks.decorate(require.context('./models/decorators', false, /\.js$/))
  ),
};

