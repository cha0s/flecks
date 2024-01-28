export const hooks = {

  /**
   * Babel configuration.
   */
  '@flecks/core.babel': () => ({
    plugins: ['...'],
  }),

  /**
   * Define configuration. See [the configuration page](./config) for more details.
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
   * Invoked when a fleck is HMR'd
   * @param {string} path The path of the fleck
   * @param {Module} updatedFleck The updated fleck module.
   */
  '@flecks/core.hmr': (path, updatedFleck) => {
    if ('my-fleck' === path) {
      updatedFleck.doSomething();
    }
  },

  /**
   * Invoked when a gathered set is HMR'd.
   * @param {constructor} gathered The gathered set.
   * @param {string} hook The gather hook; e.g. `@flecks/db.models`.
   */
  '@flecks/core.hmr.gathered': (gathered, hook) => {
    // Do something with the gathered set...
  },

  /**
   * Invoked when a gathered class is HMR'd.
   * @param {constructor} Class The class.
   * @param {string} hook The gather hook; e.g. `@flecks/db.models`.
   */
  '@flecks/core.hmr.gathered.class': (Class, hook) => {
    // Do something with Class...
  },

  /**
   * Invoked when flecks is building a fleck dependency graph.
   * @param {Digraph} graph The dependency graph.
   * @param {string} hook The hook; e.g. `@flecks/server.up`.
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
   */
  '@flecks/core.registered': (fleck, M) => {
    if ('@something/or-other' === fleck) {
      doSomethingWith(M);
    }
  },

  /**
   * Invoked when the application is starting. Use for startup tasks.
   */
  '@flecks/core.starting': () => {
    console.log('starting!');
  },

};
