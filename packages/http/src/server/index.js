import {D, Hooks} from '@flecks/core';
import {Flecks, spawnWith} from '@flecks/core/server';

import {configSource, inlineConfig} from './config';
import {createHttpServer} from './http';

const debug = D('@flecks/http/server');

export default {
  [Hooks]: {
    '@flecks/core.build.alter': (neutrinoConfigs, flecks) => {
      // Bail if there's no http build.
      if (!neutrinoConfigs.http) {
        return;
      }
      // Bail if the build isn't watching.
      if (!process.argv.find((arg) => '--watch' === arg)) {
        return;
      }
      // Otherwise, spawn `webpack-dev-server` (WDS).
      const cmd = [
        'npx', 'webpack-dev-server',
        '--mode', 'development',
        '--hot',
        '--config', flecks.buildConfig('webpack.config.js'),
      ];
      spawnWith(
        cmd,
        {
          env: {
            FLECKS_CORE_BUILD_LIST: 'http',
          },
        },
      );
      // Remove the build config since we're handing off to WDS.
      // eslint-disable-next-line no-param-reassign
      delete neutrinoConfigs.http;
    },
    '@flecks/core.build.config': () => [
      /**
       * Template file used to generate the client HTML.
       *
       * See: https://github.com/jantimon/html-webpack-plugin/blob/main/docs/template-option.md
       */
      'template.ejs',
    ],
    '@flecks/core.config': () => ({
      /**
       * (webpack-dev-server) Host to bind.
       */
      devHost: 'localhost',
      /**
       * (webpack-dev-server) Port to bind.
       */
      devPort: undefined,
      /**
       * (webpack-dev-server) Public path to serve.
       */
      devPublic: undefined,
      /**
       * (webpack-dev-server) Webpack stats output.
       */
      devStats: 'minimal',
      /**
       * Host to bind.
       */
      host: '0.0.0.0',
      /**
       * Build path.
       */
      output: 'http',
      /**
       * Port to bind.
       */
      port: 32340,
      /**
       * Proxies to trust.
       *
       * See: https://www.npmjs.com/package/proxy-addr
       */
      trust: false,
    }),
    '@flecks/core.starting': (flecks) => {
      debug('bootstrapping flecks...');
      const httpFlecks = Flecks.bootstrap({platforms: ['client'], without: ['server']});
      debug('bootstrapped');
      flecks.set('$flecks/http.flecks', httpFlecks);
    },
    '@flecks/core.targets': () => ['http'],
    '@flecks/http.routes': (flecks) => [
      {
        method: 'get',
        path: '/flecks.config.js',
        middleware: async (req, res) => {
          res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
          res.send(await configSource(flecks, req));
        },
      },
    ],
    '@flecks/http/server.stream.html': inlineConfig,
    '@flecks/server.up': (flecks) => createHttpServer(flecks),
    '@flecks/repl.context': (flecks) => ({
      httpServer: flecks.get('$flecks/http/server.instance'),
    }),
  },
};
