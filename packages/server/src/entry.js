import {mkdir} from 'fs/promises';
import {tmpdir} from 'os';
import {join} from 'path';

import {D} from '@flecks/core';
import {Flecks} from '@flecks/core/server';

const {version} = require('../package.json');

(async () => {
  const runtime = await __non_webpack_require__('@flecks/server/runtime');
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
  const debug = D(runtime.config['@flecks/core']?.id || 'flecks');
  debug('starting server...');
  const flecks = new Flecks(runtime);
  global.flecks = flecks;
  try {
    await flecks.up('@flecks/server.up');
    debug('up!');
  }
  catch (error) {
    debug(error);
  }
})();
