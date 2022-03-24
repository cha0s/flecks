import {join} from 'path';

import airbnb from '@neutrinojs/airbnb';
import neutrino from 'neutrino';

import {Hooks} from '../flecks';
import commands from './commands';
import R from '../bootstrap/require';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

export {dump as dumpYml, load as loadYml} from 'js-yaml';

export {
  default as commands,
  processCode,
  spawnWith,
  targetNeutrino,
  targetNeutrinos,
} from './commands';
export {default as Flecks} from './flecks';
export {default as fleck} from '../bootstrap/fleck';
export {default as require} from '../bootstrap/require';
export {JsonStream, transform} from './stream';

export default {
  [Hooks]: {
    '@flecks/core.build': (target, config, flecks) => {
      const {
        'eslint.exclude': exclude,
        profile,
      } = flecks.get('@flecks/core/server');
      if (-1 !== profile.indexOf(target)) {
        config.use.push(({config}) => {
          config
            .plugin('profiler')
            .use(
              R.resolve('webpack/lib/debug/ProfilingPlugin'),
              [{outputPath: join(FLECKS_CORE_ROOT, `profile.build-${target}.json`)}],
            );
        });
      }
      if (-1 === exclude.indexOf(target)) {
        const baseConfig = R(flecks.buildConfig('.eslint.defaults.js', target));
        const webpackConfig = neutrino(config).webpack();
        config.use.unshift(
          airbnb({
            eslint: {
              baseConfig: {
                ...baseConfig,
                settings: {
                  ...(baseConfig.settings || {}),
                  'import/resolver': {
                    ...(baseConfig.settings['import/resolver'] || {}),
                    webpack: {
                      config: {
                        resolve: webpackConfig.resolve,
                      },
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
       * ESLint defaults. The default .eslintrc.js just reads from this file so that the build
       * process can dynamically configure parts of ESLint.
       */
      ['.eslint.defaults.js', {specifier: (specific) => `${specific}.eslint.defaults.js`}],
      /**
       * ESLint configuration. See: https://eslint.org/docs/user-guide/configuring/
       */
      ['.eslintrc.js', {specifier: (specific) => `${specific}.eslintrc.js`}],
      /**
       * Neutrino build configuration. See: https://neutrinojs.org/usage/
       */
      ['.neutrinorc.js', {specifier: (specific) => `${specific}.neutrinorc.js`}],
      /**
       * Webpack (v4) configuration. See: https://v4.webpack.js.org/configuration/
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
  },
};
