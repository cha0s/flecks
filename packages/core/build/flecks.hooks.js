export const hooks = {

  /**
   * Babel configuration.
   * @invoke SequentialAsync
   */
  '@flecks/core.babel': () => ({
    plugins: ['...'],
  }),

  /**
   * Define configuration. See [the configuration page](./config) for more details.
   * @invoke Fleck
   */
  '@flecks/core.config': () => ({
    whatever: 'configuration',
    your: 1337,
    fleck: 'needs',
    /**
     * Also, comments like this will be used to automatically generate documentation.
     */
    though: 'you should keep the values serializable',
  }),

  /**
   * Let flecks gather for you.
   *
   * See [the Gathering guide](../gathering).
   * @invoke Async
   */
  '@flecks/core.gathered': () => ({
    // If this hook is implemented by a fleck called `@some/fleck`, then:
    //
    // This is equivalent to flecks.gather('@some/fleck.somethings'):
    somethings: {},
    //
    // This is equivalent to flecks.gather('@some/fleck.others', {typeProperty: 'name'}):
    others: {
      typeProperty: 'name',
    },
  }),

  /**
   * Invoked when a module is HMR'd. Throw to abort hot reload and restart application.
   * Must be synchronous.
   *
   * @param {string} path The path of the fleck
   * @param {Module} updated The updated module.
   * @invokeSequential
   */
  '@flecks/core.hmr': (path, updated) => {
    if ('my-fleck' === path) {
      updated.doSomething();
    }
  },

  /**
   * Invoked when a gathered set is HMR'd.
   * @param {constructor} gathered The gathered set.
   * @param {string} hook The gather hook; e.g. `@flecks/db.models`.
   * @invoke
   */
  '@flecks/core.hmr.gathered': (gathered, hook) => {
    // Do something with the gathered set...
  },

  /**
   * Invoked when a gathered class is HMR'd.
   * @param {constructor} Class The class.
   * @param {string} hook The gather hook; e.g. `@flecks/db.models`.
   * @invoke
   */
  '@flecks/core.hmr.gathered.class': (Class, hook) => {
    // Do something with Class...
  },

  /**
   * Invoked when flecks is building a fleck dependency graph.
   * @param {Digraph} graph The dependency graph.
   * @param {string} hook The hook; e.g. `@flecks/server.up`.
   * @invoke
   */
  '@flecks/core.priority': (graph, hook) => {
    // Make `@flecks/socket/server`'s `@flecks/server.up` implementation depend on
    // `@flecks/db/server`'s:
    if ('@flecks/server.up' === hook) {
      graph.addDependency('@flecks/socket/server', '@flecks/db/server');
      // Remove a dependency.
      graph.removeDependency('@flecks/socket/server', '@flecks/db/server');
    }
  },

  /**
   * Invoked when a fleck is registered.
   * @param {string} fleck
   * @param {Module} M
   * @invoke
   */
  '@flecks/core.registered': (fleck, M) => {
    if ('@something/or-other' === fleck) {
      doSomethingWith(M);
    }
  },

  /**
   * Invoked when `flecks.yml` is hot reloaded. Throw to abort hot reload and restart application.
   * Must be synchronous.
   *
   * @param {string} fleck The fleck whose config changed.
   * @param {Object} config The new config.
   */
  '@flecks/core.reload': (fleck, config, flecks) => {
    if ('i-care-about' === fleck) {
      if (flecks.get(`${fleck}.volatile`) !== config.volatile) {
        throw new Error('Changes too volatile');
      }
    }
  },

  /**
   * Invoked when the application is starting.
   * @invoke SequentialAsync
   */
  '@flecks/core.starting': () => {
    console.log('starting!');
  },

};
