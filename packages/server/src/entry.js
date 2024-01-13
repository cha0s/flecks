import {mkdir} from 'fs/promises';
import {tmpdir} from 'os';
import {join} from 'path';

import {D} from '@flecks/core';
import {Flecks} from '@flecks/core/server';

const {version} = require('../package.json');

(async () => {
  const {config, loadFlecks, platforms} = await __non_webpack_require__('@flecks/server/runtime');
  // eslint-disable-next-line no-console
  console.log(`flecks server v${version}`);
  try {
    await mkdir(join(tmpdir(), 'flecks'), {recursive: true});
  }
  catch (error) {
    if ('EEXIST' !== error.code) {
      throw error;
    }
  }
  const debug = D('@flecks/server/entry');
  debug('starting server...');
  // Make resolver.
  // Flecks mixins.
  const {flecksConfig, resolver} = Flecks.makeResolverAndLoadRcs(Object.keys(config));
  Flecks.installCompilers(flecksConfig, resolver);
  global.flecks = Flecks.from({
    config,
    flecks: await loadFlecks(),
    flecksConfig,
    platforms,
    resolver,
  });
  try {
    await Promise.all(global.flecks.invokeFlat('@flecks/core.starting'));
    await global.flecks.invokeSequentialAsync('@flecks/server.up');
    debug('up!');
  }
  catch (error) {
    debug(error);
  }
})();
