import {D, Flecks} from '@flecks/core';

(async () => {
  const config = window[Symbol.for('@flecks/web.config')];
  // eslint-disable-next-line no-console
  console.log(`flecks client v${config['@flecks/web'].version} loading runtime...`);
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
  try {
    const flecks = await Flecks.from(runtime);
    window.flecks = flecks;
    const containerId = `#${config['@flecks/web'].appMountId}`;
    const container = window.document.querySelector(containerId);
    await flecks.invokeSequentialAsync('@flecks/web/client.up', container);
    const appMountContainerId = `${containerId}-container`;
    window.document.querySelector(appMountContainerId).style.display = 'block';
    debug('up!');
  }
  catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
})();

if (module.hot) {
  module.hot.accept('@flecks/web/runtime', () => {
    module.hot.invalidate();
  });
}
