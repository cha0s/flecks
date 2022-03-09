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
      'babel.config.js',
      ['.eslint.defaults.js', {specifier: (specific) => `${specific}.eslint.defaults.js`}],
      ['.eslintrc.js', {specifier: (specific) => `${specific}.eslintrc.js`}],
      ['.neutrinorc.js', {specifier: (specific) => `${specific}.neutrinorc.js`}],
      'webpack.config.js',
    ],
    '@flecks/core.commands': commands,
  },
};
