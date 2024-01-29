export const hooks = {

  /**
   * Gather database models.
   *
   * See: [the Gathering guide](../gathering).
   * @invoke MergeAsync
   */
  '@flecks/db.models': Flecks.provide(require.context('./models', false, /\.js$/)),

  /**
   * Decorate database models.
   *
   * See: [the Gathering guide](../gathering).
   *
   * @param {constructor} Model The model to decorate.
   * @invoke ComposedAsync
   */
  '@flecks/db.models.decorate': (
    Flecks.decorate(require.context('./models/decorators', false, /\.js$/))
  ),
};

