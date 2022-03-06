import {Hooks} from '@flecks/core';

export default {
  [Hooks]: {
    /**
     * Hook into neutrino configuration.
     * @param {string} target The build target; e.g. `server`.
     * @param {Object} config The neutrino configuration.
     */
    '@flecks/core/build': (target, config) => {
      if ('something' === target) {
        config[target].use.push(someNeutrinoMiddleware);
      }
    },

    /**
      * Alter build configurations after they have been hooked.
      * @param {Object} configs The neutrino configurations.
      */
    '@flecks/core/build/alter': (configs) => {
      // Maybe we want to do something if a config exists..?
      if (configs.something) {
        // Do something...
        // And then maybe we want to remove it from the build configuration..?
        delete configs.something;
      }
    },

    /**
      * Define CLI commands.
      */
    '@flecks/core/commands': (program) => ({
      // So this could be invoked like:
      // npx flecks something -t --blow-up blah
      something: {
        action: (...args) => {
          // Run the command...
        },
        args: [
          '<somearg>',
        ],
        description: 'This sure is some command',
        options: [
          '-t, --test', 'Do a test',
          '-b, --blow-up', 'Blow up instead of running the command',
        ],
      },
    }),

    /**
      * Define configuration.
      */
    '@flecks/core/config': () => ({
      whatever: 'configuration',
      your: 1337,
      fleck: 'needs',
      though: 'you should keep the values serializable',
    }),

    /**
      * Invoked when a gathered class is HMR'd.
      * @param {constructor} Class The class.
      * @param {string} hook The gather hook; e.g. `@flecks/db/server/models`.
      */
    '@flecks/core/gathered/hmr': (Class, hook) => {
      // Do something with Class...
    },

      /**
      * Invoked when a fleck is HMR'd
      * @param {string} path The path of the fleck
      * @param {Module} updatedFleck The updated fleck module.
      */
    '@flecks/core/hmr': (path, updatedFleck) => {
      if ('my-fleck' === path) {
        updatedFleck.doSomething();
      }
    },

    /**
      * Invoked when the application is starting. Use for order-independent initialization tasks.
      */
    '@flecks/core/starting': (flecks) => {
      flecks.set('$my-fleck/value', initializeMyValue());
    },

    /**
      * Define neutrino build targets.
      */
    '@flecks/core/targets': () => ['sometarget'],

    /**
      * Hook into webpack configuration.
      * @param {string} target The build target; e.g. `server`.
      * @param {Object} config The neutrino configuration.
      */
    '@flecks/core/webpack': (target, config) => {
      if ('something' === target) {
        config.stats = 'verbose';
      }
    },
  },
};

