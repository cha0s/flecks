import {mkdir} from 'fs/promises';
import {tmpdir} from 'os';
import {join} from 'path';

import {D, Flecks} from '@flecks/core';

const {version} = require('../package.json');

(async () => {
  const runtime = await __non_webpack_require__('@flecks/server/runtime');
  const {loadFlecks} = runtime;
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
  global.flecks = await Flecks.from({...runtime, flecks: await loadFlecks()});
  try {
    await Promise.all(global.flecks.invokeFlat('@flecks/core.starting'));
    await global.flecks.invokeSequentialAsync('@flecks/server.up');
    debug('up!');
  }
  catch (error) {
    debug(error);
  }
})();
