const {join} = require('path');

const webpack = require('webpack');

const {commands} = require('./commands');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

exports.hooks = {
  '@flecks/core.exts': () => ['.mjs', '.js', '.json', '.wasm'],
  '@flecks/core.build': async (target, config, env, argv, flecks) => {
    if (flecks.get('@flecks/core.profile').includes(target)) {
      config.plugins.push(
        new webpack.debug.ProfilingPlugin({
          outputPath: join(FLECKS_CORE_ROOT, `profile.build-${target}.json`),
        }),
      );
    }
  },
  '@flecks/core.build.config': () => [
    /**
     * Babel configuration. See: https://babeljs.io/docs/en/config-files
     */
    'babel.config.js',
    /**
     * ESLint defaults. The generated `eslint.config.js` just reads from this file so that the
     * build can dynamically configure parts of ESLint.
     */
    'default.eslint.config.js',
    /**
     * ESLint configuration managed by flecks to allow async.
     */
    'eslint.config.js',
    /**
     * Flecks webpack configuration. See: https://webpack.js.org/configuration/
     */
    'fleckspack.config.js',
    /**
     * Fleck build configuration. See: https://webpack.js.org/configuration/
     */
    'fleck.webpack.config.js',
  ],
  '@flecks/core.commands': commands,
  '@flecks/core.config': () => ({
    /**
     * The ID of your application.
     */
    id: 'flecks',
    /**
     * The package manager used for tasks.
     */
    packageManager: 'npm',
    /**
     * Build targets to profile with `webpack.debug.ProfilingPlugin`.
     */
    profile: [],
  }),
};
