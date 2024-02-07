import cluster from 'cluster';
import {mkdir} from 'fs/promises';
import {tmpdir} from 'os';
import {join} from 'path';

import {D, Flecks} from '@flecks/core';

(async () => {
  const runtime = await import('@flecks/server/runtime');
  const {loadFlecks, version} = runtime;
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
  try {
    global.flecks = await Flecks.from({...runtime, flecks: await loadFlecks()});
    await global.flecks.invokeSequentialAsync('@flecks/server.up');
    debug('up!');
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
})();

if (module.hot) {
  module.hot.accept('@flecks/server/runtime', () => {
    if (cluster.isWorker) {
      cluster.worker.disconnect();
      const error = new Error('Restart requested!');
      error.stack = '';
      throw error;
    }
  });
}
