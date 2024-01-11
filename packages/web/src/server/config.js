import {Transform} from 'stream';

const config = async (flecks, req) => {
  const httpConfig = await flecks.invokeMergeAsync('@flecks/web.config', req);
  const {config} = flecks.web.flecks;
  const reducedConfig = Object.keys(config)
    .filter((path) => !path.startsWith('$'))
    .filter((path) => !path.endsWith('/server'))
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
  // Fold in any bespoke configuration.
  Object.keys(httpConfig)
    .forEach((key) => {
      if (!(key in reducedConfig)) {
        reducedConfig[key] = httpConfig[key];
      }
    });
  return reducedConfig;
};

export const configSource = async (flecks, req) => {
  const codedConfig = encodeURIComponent(JSON.stringify(await config(flecks, req)));
  return `window[Symbol.for('@flecks/web.config')] = JSON.parse(decodeURIComponent("${
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
    const string = chunk.toString('utf8');
    const {appMountId} = this.flecks.get('@flecks/web/server');
    const rendered = string.replaceAll(
      '<body>',
      [
        '<body>',
        `<div id="${appMountId}-container">`,
        `<script>${await configSource(this.flecks, this.req)}</script>`,
        `<div id="${appMountId}"></div>`,
        '</div>',
      ].join(''),
    );
    this.push(rendered);
    done();
  }

}

export const inlineConfig = (stream, req, flecks) => stream.pipe(new InlineConfig(flecks, req));
