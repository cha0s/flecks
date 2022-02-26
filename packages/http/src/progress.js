import D from 'debug';

const debug = D('@flecks/http/progress');

export default class Progress {

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
    }, 250);
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
