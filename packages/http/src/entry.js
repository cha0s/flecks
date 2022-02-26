import D from 'debug';
import {Flecks} from '@flecks/core';

/* global __non_webpack_import__ */

const {version} = require('../package.json');

let finished = 0;
const $progress = window.document.createElement('div');
const {style} = $progress;
style.backgroundColor = '#004488';
style.border = 0;
style.display = 'none';
style.height = '0.17em';
style.left = 0;
style.margin = 0;
style.padding = 0;
style.position = 'absolute';
style.top = 0;
style.transition = '1s width, 0.5s opacity';
setTimeout(() => {
  style.display = 'block';
}, 250);
$progress.style.width = '0%';
$progress.value = 0;
window.document.body.prepend($progress);

(async () => {
  // eslint-disable-next-line no-console
  console.log(`flecks client v${version} loading runtime...`);
  const config = window[Symbol.for('@flecks/http/config')];
  const debug = D(config['@flecks/core']?.id || 'flecks');
  debug('loading runtime...');
  const {default: loader} = await __non_webpack_import__(
    /* @preserve webpackChunkName: "flecks-runtime" */
    '@flecks/http/runtime',
  );
  const runtime = await loader((total, path) => {
    finished += 1;
    debug('loaded %s (%d/%d)', path, finished, total);
    $progress.style.width = `${100 * (finished / total)}%`;
  });
  $progress.style.opacity = 0;
  debug('starting client...');
  const flecks = new Flecks(runtime);
  window.flecks = flecks;
  try {
    await flecks.up('@flecks/http/client/up');
    debug('up!');
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
})();