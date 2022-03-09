import {Transform} from 'stream';

const config = async (flecks, req) => {
  const httpConfig = await flecks.invokeMergeAsync('@flecks/http.config', req);
  const config = {};
  const {resolver} = flecks.get('$flecks/http.flecks');
  const keys = Object.keys(resolver);
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    config[key] = flecks.get(key) || {};
  }
  return Object.keys(config)
    .reduce(
      (r, key) => ({
        ...r,
        [key]: {
          ...(config[key] || {}),
          ...(httpConfig[key] || {}),
        },
      }),
      {},
    );
};

export const configSource = async (flecks, req) => {
  const codedConfig = encodeURIComponent(JSON.stringify(await config(flecks, req)));
  return `window[Symbol.for('@flecks/http.config')] = JSON.parse(decodeURIComponent("${
    codedConfig
  }"));`;
};

class InlineConfig extends Transform {

  constructor(flecks, req) {
    super();
    this.flecks = flecks;
    this.req = req;
  }

  // eslint-disable-next-line no-underscore-dangle
  async _transform(chunk, encoding, done) {
    const string = chunk
      .toString('utf8');
    if (-1 !== string.indexOf('<script src="/flecks.config.js"></script>')) {
      this.push(
        string.replace(
          '<script src="/flecks.config.js"></script>',
          `<script>${await configSource(this.flecks, this.req)}</script>`,
        ),
      );
    }
    else {
      this.push(string);
    }
    done();
  }

}

export const inlineConfig = (stream, req, flecks) => stream.pipe(new InlineConfig(flecks, req));
