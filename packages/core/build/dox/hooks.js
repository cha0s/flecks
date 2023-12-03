export const hooks = {

  /**
   * Hook into webpack configuration.
   * @param {string} target The build target; e.g. `server`.
   * @param {Object} config The webpack configuration.
   * @param {Object} env The webpack environment.
   * @param {Object} argv The webpack commandline arguments.
   * @see {@link https://webpack.js.org/configuration/configuration-types/#exporting-a-function}
   */
  '@flecks/core.build': (target, config, env, argv) => {
    if ('something' === target) {
      if ('production' === argv.mode) {
        config.plugins.push(new SomePlugin());
      }
    }
  },

  /**
   * Alter build configurations after they have been hooked.
   * @param {Object} configs The webpack configurations keyed by target.
   * @param {Object} env The webpack environment.
   * @param {Object} argv The webpack commandline arguments.
   * @see {@link https://webpack.js.org/configuration/configuration-types/#exporting-a-function}
   */
  '@flecks/core.build.alter': (configs) => {
    // Maybe we want to do something if a target exists..?
    if (configs.someTarget) {
      // Do something...
      // And then maybe we want to remove it from the build configuration..? That's ok!
      delete configs.someTarget;
    }
  },

  /**
   * Register build configuration.
   */
  '@flecks/core.build.config': () => [
    /**
     * If you document your config files like this, documentation will be automatically
     * generated.
     */
    '.myrc.js',
    /**
     * Make sure you return them as an array expression, like this.
     */
    ['something.config.js', {specifier: (specific) => `something.${specific}.config.js`}],
  ],

  /**
   * Define CLI commands.
   */
  '@flecks/core.commands': (program) => ({
    // So this could be invoked like:
    // npx flecks something -t --blow-up blah
    something: {
      action: (...args) => {
        // Run the command...
      },
      args: [
        '<somearg>',
      ],
      description: 'This command does tests and also blows up',
      options: [
        '-t, --test', 'Do a test',
        '-b, --blow-up', 'Blow up instead of running the command',
      ],
    },
  }),

  /**
   * Define configuration.
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
   * Invoked when a gathered class is HMR'd.
   * @param {constructor} Class The class.
   * @param {string} hook The gather hook; e.g. `@flecks/db/server.models`.
   */
  '@flecks/core.hmr.gathered': (Class, hook) => {
    // Do something with Class...
  },

  /**
   * Invoked when the application is starting. Use for order-independent initialization tasks.
   */
  '@flecks/core.starting': (flecks) => {
    flecks.set('$my-fleck/value', initializeMyValue());
  },

  /**
   * Define build targets.
   */
  '@flecks/core.targets': () => ['sometarget'],
};
