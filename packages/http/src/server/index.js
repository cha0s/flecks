import {Hooks} from '@flecks/core';
import {Flecks, spawnWith} from '@flecks/core/server';
import D from 'debug';

import {configSource, inlineConfig} from './config';
import {createHttpServer} from './http';

const debug = D('@flecks/http/server');

export default {
  [Hooks]: {
    '@flecks/core/build/alter': (neutrinoConfigs, flecks) => {
      // Bail if there's no http build.
      if (!neutrinoConfigs.http) {
        return;
      }
      // Bail if the build isn't watching.
      if (!process.argv.find((arg) => '--watch' === arg)) {
        return;
      }
      // Otherwise, spawn `webpack-dev-server` (WDS).
      const localEnv = {
        FLECKS_BUILD_LIST: 'http',
      };
      const spawnArgs = [
        '--mode', 'development',
        '--hot',
        '--config', flecks.localConfig('webpack.config.js', '@flecks/core'),
      ];
      spawnWith('webpack-dev-server', localEnv, spawnArgs);
      // Remove the build config since we're handing off to WDS.
      // eslint-disable-next-line no-param-reassign
      delete neutrinoConfigs.http;
    },
    '@flecks/core/config': () => ({
      'stream.html': ['...'],
      'request.route': [],
      'request.socket': [],
      trust: false,
      up: ['...'],
    }),
    '@flecks/core/starting': (flecks) => {
      debug('bootstrapping flecks...');
      const httpFlecks = Flecks.bootstrap({platforms: ['client'], without: ['server']});
      debug('bootstrapped');
      flecks.set('$flecks/http.flecks', httpFlecks);
    },
    '@flecks/core/targets': () => ['http'],
    '@flecks/http/routes': (flecks) => [
      {
        method: 'get',
        path: '/flecks.config.js',
        middleware: async (req, res) => {
          res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
          res.send(await configSource(flecks, req));
        },
      },
    ],
    '@flecks/http/server/stream.html': inlineConfig,
    '@flecks/server/up': (flecks) => createHttpServer(flecks),
    '@flecks/repl/context': (flecks) => ({
      httpServer: flecks.get('$flecks/http/server.instance'),
    }),
  },
};