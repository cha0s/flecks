const {join} = require('path');

const webpack = require('webpack');

const {commands} = require('./commands');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

exports.hooks = {
  '@flecks/build.extensions': () => ['.mjs', '.js', '.json', '.wasm'],
  '@flecks/build.config': async (target, config, env, argv, flecks) => {
    if (flecks.get('@flecks/build.profile').includes(target)) {
      config.plugins.push(
        new webpack.debug.ProfilingPlugin({
          outputPath: join(FLECKS_CORE_ROOT, `profile.build-${target}.json`),
        }),
      );
    }
    if (Object.entries(flecks.compiled).length > 0) {
      config.resolve.symlinks = false;
    }
  },
  '@flecks/build.files': () => [
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
  '@flecks/build.commands': commands,
  '@flecks/core.config': () => ({
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
