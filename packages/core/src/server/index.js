import {join} from 'path';
import {inspect} from 'util';

import webpack from 'webpack';

import commands from './commands';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const {defaultOptions} = inspect;
defaultOptions.breakLength = 160;
defaultOptions.compact = 6;
defaultOptions.sorted = true;

export {dump as dumpYml, load as loadYml} from 'js-yaml';

export {
  Argument,
  default as commands,
  Option,
  processCode,
  program,
  spawnWith,
} from './commands';
export {default as Flecks} from './flecks';
export {default as require} from '../require';
export {JsonStream, transform} from './stream';
export * from './webpack';

export {webpack};

export const hooks = {
  '@flecks/core.build': async (target, config, env, argv, flecks) => {
    const {
      profile,
    } = flecks.get('@flecks/core/server');
    if (profile.includes(target)) {
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
    ['default.eslint.config.js', {specifier: false}],
    /**
     * ESLint configuration. See: https://eslint.org/docs/user-guide/configuring/
     */
    ['eslint.config.js', {specifier: false}],
    /**
     * Flecks webpack configuration. See: https://webpack.js.org/configuration/
     */
    ['fleckspack.config.js', {specifier: false}],
    /**
     * Webpack configuration. See: https://webpack.js.org/configuration/
     */
    'webpack.config.js',
  ],
  '@flecks/core.commands': commands,
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
