export const hooks = {

  /**
   * Hook into webpack configuration.
   * @param {string} target The build target; e.g. `server`.
   * @param {Object} config The webpack configuration.
   * @param {Object} env The webpack environment.
   * @param {Object} argv The webpack commandline arguments.
   * @see {@link https://webpack.js.org/configuration/configuration-types/#exporting-a-function}
   */
  '@flecks/build.config': (target, config, env, argv) => {
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
  '@flecks/build.config.alter': (configs) => {
    // Maybe we want to do something if a target exists..?
    if (configs.someTarget) {
      configs.plugins.push('...');
    }
  },

  /**
   * Add implicitly resolved extensions.
   */
  '@flecks/build.extensions': () => ['.coffee'],

  /**
   * Register build files.
   */
  '@flecks/build.files': () => [
    /**
     * If you document your build files like this, documentation will be automatically generated.
     */
    '.myrc.js',
  ],

  /**
   * Define CLI commands.
   * @param {[Command](https://github.com/tj/commander.js/tree/master#declaring-program-variable)} program The [Commander.js](https://github.com/tj/commander.js) program.
   */
  '@flecks/build.commands': (program, flecks) => {
    return {
      // So this could be invoked like:
      // npx flecks something -t --blow-up blah
      something: {
        action: (...args) => {
          // Run the command...
        },
        args: [
          program.createArgument('<somearg>', 'some argument'),
        ],
        description: 'This command does tests and also blows up',
        options: [
          '-t, --test', 'Do a test',
          '-b, --blow-up', 'Blow up instead of running the command',
        ],
      },
    };
  },

  /**
   * Process the `package.json` for a built fleck.
   * @param {Object} json The JSON.
   * @param {[Compilation](https://webpack.js.org/api/compilation-object/)} compilation The webpack compilation.
   */
  '@flecks/build.packageJson': (json, compilation) => {
    json.files.push('something');
  },

  /**
   * Process assets during a compilation.
   * @param {Record&lt;string, Source&gt;} assets The assets.
   * @param {[Compilation](https://webpack.js.org/api/compilation-object/)} compilation The webpack compilation.
   */
  '@flecks/build.processAssets': (assets, compilation) => {
    assets['my-file.js'] = new Source();
  },

  /**
   * Define build targets.
   */
  '@flecks/build.targets': () => ['sometarget'],

  /**
   * Alter defined build targets.
   * @param {Set&lt;string&gt;} targets The targets to build.
   */
  '@flecks/build.targets.alter': (targets) => {
    targets.delete('some-target');
  },

};
