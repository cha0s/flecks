import airbnb from '@neutrinojs/airbnb';

import {Hooks} from '../flecks';
import commands from './commands';
import R from '../bootstrap/require';

export {
  default as commands,
  processCode,
  spawnWith,
  targetNeutrino,
  targetNeutrinos,
} from './commands';

export {default as Flecks} from './flecks';
export {default as require} from '../bootstrap/require';
export {JsonStream, transform} from './stream';

export default {
  [Hooks]: {
    '@flecks/core.build': (target, config, flecks) => {
      const {'eslint.exclude': exclude} = flecks.get('@flecks/core');
      if (-1 !== exclude.indexOf(target)) {
        return;
      }
      const baseConfig = R(flecks.buildConfig('.eslint.defaults.js', target));
      config.use.unshift(
        airbnb({
          eslint: {
            baseConfig: {
              ...baseConfig,
              env: {
                mocha: true,
              },
            },
          },
        }),
      );
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
  },
};
