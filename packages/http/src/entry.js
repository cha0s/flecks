import {D, Flecks} from '@flecks/core';

import Progress from './progress';

/* global __non_webpack_import__ */

const {version} = require('../package.json');

const progress = new Progress(window);

(async () => {
  // eslint-disable-next-line no-console
  console.log(`flecks client v${version} loading runtime...`);
  const config = window[Symbol.for('@flecks/http.config')];
  const debug = D(config['@flecks/core']?.id || 'flecks');
  debug('loading runtime...');
  const {default: loader} = await __non_webpack_import__(
    /* @preserve webpackChunkName: "flecks-runtime" */
    '@flecks/http/runtime',
  );
  const runtime = await loader(progress.update.bind(progress));
  progress.finish();
  debug('starting client...');
  const flecks = new Flecks(runtime);
  window.flecks = flecks;
  try {
    await flecks.up('@flecks/http/client.up');
    debug('up!');
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
})();
