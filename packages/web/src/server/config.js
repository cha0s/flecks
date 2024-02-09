import {Buffer} from 'buffer';
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
    this.buffers = [];
    this.flecks = flecks;
    this.req = req;
  }

  // eslint-disable-next-line no-underscore-dangle
  async _flush(done) {
    const string = Buffer.concat(this.buffers).toString();
    const {appMountId} = this.flecks.get('@flecks/web');
    const hideAttributes = 'production' === NODE_ENV ? 'data-flecks="ignore"' : '';
    this.push(
      string.replaceAll(
        '<body>',
        /* eslint-disable indent */
        [
          '<body>',
            `<div id="${appMountId}-container">`,
              `<script${hideAttributes}>`,
                `window.document.querySelector('#${appMountId}-container').style.display = 'none'`,
              '</script>',
              '<script data-flecks="ignore">',
                await configSource(this.flecks, this.req),
              '</script>',
              `<div id="${appMountId}"></div>`,
            '</div>',
        ].join(''),
        /* eslint-enable indent */
      ),
    );
    this.buffers = [];
    done();
  }

  // eslint-disable-next-line no-underscore-dangle
  _transform(chunk, encoding, done) {
    this.buffers.push(chunk);
    done();
  }

}

export const inlineConfig = (stream, req, flecks) => stream.pipe(new InlineConfig(flecks, req));
