import cluster from 'cluster';
import {mkdir} from 'fs/promises';
import {tmpdir} from 'os';
import {join} from 'path';

import {D, Flecks} from '@flecks/core';

(async () => {
  const runtime = await import('@flecks/server/runtime');
  const {config, loadFlecks, version} = runtime;
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
  const flecks = await loadFlecks();
  global.flecks = await Flecks.from({
    ...runtime,
    config: Flecks.environmentConfiguration(Object.keys(flecks), config),
    flecks,
  });
  await global.flecks.invokeSequentialAsync('@flecks/server.up');
  debug('up!');
})();

if (module.hot) {
  module.hot.accept('@flecks/server/runtime', () => {
    module.hot.invalidate();
    if (cluster.isWorker) {
      cluster.worker.disconnect();
      const error = new Error('Restart requested!');
      error.stack = '';
      throw error;
    }
  });
}
