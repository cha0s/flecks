import {join} from 'path';
import {inspect} from 'util';

import ESLintPlugin from 'eslint-webpack-plugin';
import webpack from 'webpack';

import commands from './commands';
import R from '../require';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const {defaultOptions} = inspect;
defaultOptions.breakLength = 160;
defaultOptions.compact = 6;
defaultOptions.sorted = true;

export {dump as dumpYml, load as loadYml} from 'js-yaml';

export {
  default as commands,
  processCode,
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
      'eslint.exclude': exclude,
      profile,
    } = flecks.get('@flecks/core/server');
    if (profile.includes(target)) {
      config.plugins.push(
        new webpack.debug.ProfilingPlugin({
          outputPath: join(FLECKS_CORE_ROOT, `profile.build-${target}.json`),
        }),
      );
    }
    if (!exclude.includes(target)) {
      const eslintConfigFn = R(flecks.buildConfig('default.eslint.config.js', target));
      const eslint = await eslintConfigFn(flecks);
      config.plugins.push(
        new ESLintPlugin({
          cache: true,
          cwd: FLECKS_CORE_ROOT,
          emitWarning: argv.mode !== 'production',
          failOnError: argv.mode === 'production',
          useEslintrc: false,
          overrideConfig: {
            ...eslint,
            settings: {
              ...eslint.settings,
              'import/resolver': {
                ...eslint.settings['import/resolver'],
                webpack: {
                  config: {
                    resolve: config.resolve,
                  },
                },
              },
            },
          },
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
     * Build targets to exclude from ESLint.
     */
    'eslint.exclude': [],
    /**
     * Build targets to profile with `webpack.debug.ProfilingPlugin`.
     */
    profile: [],
  }),
};
