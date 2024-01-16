import {inspect} from 'util';

import webpack from 'webpack';

const {defaultOptions} = inspect;
defaultOptions.breakLength = 160;
defaultOptions.compact = 6;
defaultOptions.sorted = true;

export {glob} from 'glob';
export {dump as dumpYml, load as loadYml} from 'js-yaml';

export {commands, processCode, spawnWith} from '../../build/commands';
export {JsonStream, transform} from '../../build/stream';
export * from '../../build/webpack';

export {webpack};

export const hooks = {
  '@flecks/web.config': async (req, flecks) => ({
    '@flecks/core': {
      id: flecks.get('@flecks/core.id'),
      packageManager: undefined,
      profile: undefined,
    },
  }),
};
