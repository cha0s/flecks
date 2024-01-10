import {compose, D, Flecks as BaseFlecks} from '@flecks/core';

// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
const {version} = require('@flecks/web/package.json');

(async () => {
  // eslint-disable-next-line no-console
  console.log(`flecks client v${version} loading runtime...`);
  const config = window[Symbol.for('@flecks/web.config')];
  const debug = D((config['@flecks/core'] && config['@flecks/core'].id) || 'flecks');
  class Progress {

    constructor(window) {
      this.finished = 0;
      this.progress = window.document.createElement('div');
      const {style} = this.progress;
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
      }, 600);
      this.progress.style.width = '0%';
      this.progress.value = 0;
      window.document.body.prepend(this.progress);
    }

    update(total, path) {
      this.finished += 1;
      debug('loaded %s (%d/%d)', path, this.finished, total);
      this.progress.style.width = `${100 * (this.finished / total)}%`;
    }

    finish() {
      this.progress.style.opacity = 0;
    }

  }
  const progress = new Progress(window);
  debug('loading runtime...');
  // eslint-disable-next-line import/no-extraneous-dependencies
  const {default: loader} = await import(
    /* webpackChunkName: "flecks-runtime" */
    '@flecks/web/runtime'
  );
  const runtime = await loader(progress.update.bind(progress));
  progress.finish();
  debug('starting client...');
  // Flecks mixins.
  const mixins = Object.entries(runtime.flecks)
    .map(([, M]) => M.hooks?.['@flecks/core.mixin'])
    .filter((e) => e);
  const Flecks = compose(...mixins)(BaseFlecks);
  const flecks = new Flecks(runtime);
  window.flecks = flecks;
  try {
    await Promise.all(flecks.invokeFlat('@flecks/core.starting'));
    await flecks.invokeSequentialAsync('@flecks/web/client.up');
    const appMountId = `#${config['@flecks/web/client'].appMountId}`;
    window.document.querySelector(appMountId).style.display = 'block';
    debug('up!');
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
})();
