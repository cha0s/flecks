import {D, Hooks} from '@flecks/core';
import {Flecks, spawnWith} from '@flecks/core/server';
import fontLoader from '@neutrinojs/font-loader';
import imageLoader from '@neutrinojs/image-loader';
import styleLoader from '@neutrinojs/style-loader';

import {configSource, inlineConfig} from './config';
import {createHttpServer} from './http';

const debug = D('@flecks/http/server');

export default {
  [Hooks]: {
    '@flecks/core.build': (target, config, flecks) => {
      config.use.push((neutrino) => {
        const isProduction = 'production' === neutrino.config.get('mode');
        neutrino.use(
          styleLoader({
            extract: {
              enabled: 'http' === target,
            },
            modules: {
              localIdentName: isProduction ? '[hash]' : '[path][name]__[local]',
            },
            style: {
              injectType: 'lazyStyleTag',
            },
            test: /\.(c|s[ac])ss$/,
            modulesTest: /\.module\.(c|s[ac])ss$/,
            loaders: [
              {
                loader: 'postcss-loader',
                useId: 'postcss',
                options: {
                  postcssOptions: {
                    config: flecks.buildConfig('postcss.config.js'),
                  },
                },
              },
              {
                loader: 'sass-loader',
                useId: 'sass',
              },
            ],
          }),
        );
      });
      config.use.push(fontLoader());
      config.use.push(imageLoader());
    },
    '@flecks/core.build.alter': (neutrinoConfigs, flecks) => {
      // Don't build if there's a fleck target.
      if (neutrinoConfigs.fleck && !flecks.get('@flecks/http/server.forceBuildWithFleck')) {
        // eslint-disable-next-line no-param-reassign
        delete neutrinoConfigs.http;
        return;
      }
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
      /**
       * PostCSS config file.
       *
       * See: https://github.com/postcss/postcss#usage
       */
      'postcss.config.js',
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
      devStats: {
        chunks: false,
        colors: true,
        modules: false,
      },
      /**
       * Force building http target even if there's a fleck target.
       */
      forceBuildWithFleck: false,
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
       * Webpack stats configuration when building HTTP target.
       */
      stats: {
        chunks: false,
        colors: true,
        modules: false,
      },
      /**
       * Proxies to trust.
       *
       * See: https://www.npmjs.com/package/proxy-addr
       */
      trust: false,
    }),
    '@flecks/core.starting': (flecks) => {
      debug('bootstrapping flecks...');
      const httpFlecks = Flecks.bootstrap({
        config: flecks.config,
        platforms: ['client', '!server'],
      });
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
