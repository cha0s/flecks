import {mkdir} from 'fs/promises';
import {tmpdir} from 'os';
import {join} from 'path';

import {compose, D} from '@flecks/core';
import {Flecks as BaseFlecks} from '@flecks/core/server';

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
  const resolver = BaseFlecks.makeResolver(config);
  const rcs = BaseFlecks.loadRcs(resolver);
  BaseFlecks.installCompilers(rcs, resolver);
  const flecks = await loadFlecks();
  const mixins = Object.entries(flecks)
    .map(([, M]) => M.hooks?.['@flecks/core.mixin'])
    .filter((e) => e);
  const Flecks = compose(...mixins)(BaseFlecks);
  global.flecks = new Flecks({
    config,
    flecks,
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
