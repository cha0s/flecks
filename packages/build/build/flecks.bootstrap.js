const {join} = require('path');

const webpack = require('webpack');

const {commands} = require('./commands');
const {ProcessAssets} = require('./process-assets');
const {externals} = require('./webpack');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

exports.hooks = {
  '@flecks/build.extensions': () => ['.mjs', '.js', '.json', '.wasm'],
  '@flecks/build.commands': commands,
  '@flecks/build.config': async (target, config, env, argv, flecks) => {
    if (flecks.get('@flecks/build.profile').includes(target)) {
      config.plugins.push(
        new webpack.debug.ProfilingPlugin({
          outputPath: join(FLECKS_CORE_ROOT, `profile.build-${target}.json`),
        }),
      );
    }
    if (flecks.roots.some(([path, request]) => path !== request)) {
      config.resolve.symlinks = false;
    }
    config.plugins.push(new ProcessAssets(target, flecks));
  },
  '@flecks/build.config.alter': async ({test}, env, argv, flecks) => {
    if (test) {
      // Externalize the rest.
      test.externals = await externals({
        additionalModuleDirs: flecks.resolver.modules,
        allowlist: Object.keys(test.resolve.fallback).map((fallback) => new RegExp(fallback)),
      });
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
     * Fleck source build configuration. See: https://webpack.js.org/configuration/
     */
    'fleck.webpack.config.js',
    /**
     * Fleck test build configuration. See: https://webpack.js.org/configuration/
     */
    'test.webpack.config.js',
  ],
  '@flecks/core.config': () => ({
    /**
     * Build targets to profile with `webpack.debug.ProfilingPlugin`.
     */
    profile: [],
  }),
};
