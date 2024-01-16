import {D} from '@flecks/core';
import Server from '@flecks/core/build/server';

import {configSource, inlineConfig} from './config';
import {createHttpServer} from './http';

const debug = D('@flecks/web/server');

export {configSource};

export const hooks = {
  '@flecks/core.mixin': (Flecks) => (
    class FlecksWithWeb extends Flecks {

      constructor(...args) {
        super(...args);
        if (!this.web) {
          this.web = {flecks: undefined, server: undefined};
        }
      }

    }
  ),
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
  '@flecks/web/server.up': async (server, flecks) => {
    debug('bootstrapping flecks...');
    flecks.web.flecks = await Server.from({
      config: flecks.config,
      platforms: ['client', '!server'],
    });
    debug('bootstrapped');
  },
  '@flecks/server.up': (flecks) => createHttpServer(flecks),
};
