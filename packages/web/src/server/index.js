import {D} from '@flecks/core';

import {configSource, inlineConfig} from './config';
import {createHttpServer} from './http';

const debug = D('@flecks/web/server');

export {configSource};

export const hooks = {
  '@flecks/web.config': async ({onlyAllow}, flecks) => ({
    '@flecks/web': onlyAllow(flecks.get('@flecks/web'), ['appMountId', 'title']),
  }),
  '@flecks/web.routes': (flecks) => [
    {
      method: 'get',
      path: '/flecks.config.js',
      middleware: async (req, res) => {
        res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
        res.send(await configSource(flecks, req));
      },
    },
  ],
  '@flecks/web/server.stream.html': inlineConfig,
  '@flecks/server.up': (flecks) => createHttpServer(flecks),
};

export const mixin = (Flecks) => class FlecksWithWeb extends Flecks {

  constructor(runtime) {
    super(runtime);
    if (!this.web) {
      this.web = {config: runtime['@flecks/web'], server: undefined};
    }
  }

};
