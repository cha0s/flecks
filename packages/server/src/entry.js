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
  const debug = D(config['@flecks/core']?.id || 'flecks');
  debug('starting server...');
  // Make resolver.
  const resolver = Flecks.makeResolver(config);
  const rcs = Flecks.loadRcs(resolver);
  Flecks.installCompilers(rcs, resolver);
  global.flecks = new Flecks({
    config,
    flecks: await loadFlecks(),
    platforms,
    resolver,
    rcs,
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
