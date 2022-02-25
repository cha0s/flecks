import airbnb from '@neutrinojs/airbnb';

import {Hooks} from '../flecks';
import commands from './commands';
import R from '../bootstrap/require';

export {
  default as commands,
  spawnWith,
  targetNeutrino,
  targetNeutrinos,
} from './commands';

export {default as Flecks} from './flecks';
export {default as require} from '../bootstrap/require';

export default {
  [Hooks]: {
    '@flecks/core/build': (target, config, flecks) => {
      const {'eslint.exclude': exclude} = flecks.get('@flecks/core');
      if (-1 !== exclude.indexOf(target)) {
        return;
      }
      const baseConfig = R(
        flecks.localConfig(
          `${target}.eslint.defaults.js`,
          '@flecks/core',
          {general: '.eslint.defaults.js'},
        ),
      );
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
    '@flecks/core/commands': commands,
  },
};
