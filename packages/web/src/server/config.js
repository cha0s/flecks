import {Transform} from 'stream';

const {
  NODE_ENV,
} = process.env;

export const configSource = async (flecks, req) => (
  `window[Symbol.for('@flecks/web.config')] = JSON.parse(decodeURIComponent("${
    encodeURIComponent(JSON.stringify(await flecks.invokeAsync('@flecks/web.config', req)))
  }"));`
);

class InlineConfig extends Transform {

  constructor(flecks, req) {
    super();
    this.flecks = flecks;
    this.req = req;
  }

  // eslint-disable-next-line no-underscore-dangle
  async _transform(chunk, encoding, done) {
    const string = chunk.toString('utf8');
    const {appMountId} = this.flecks.get('@flecks/web');
    const rendered = string.replaceAll(
      '<body>',
      [
        '<body>',
        `<div id="${appMountId}-container">`,
        `<script${'production' === NODE_ENV ? 'data-flecks="ignore"' : ''}>window.document.querySelector('#${appMountId}-container').style.display = 'none'</script>`,
        `<script data-flecks="ignore">${await configSource(this.flecks, this.req)}</script>`,
        `<div id="${appMountId}"></div>`,
        '</div>',
      ].join(''),
    );
    this.push(rendered);
    done();
  }

}

export const inlineConfig = (stream, req, flecks) => stream.pipe(new InlineConfig(flecks, req));
