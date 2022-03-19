import {stat, unlink} from 'fs/promises';
import {join} from 'path';

import {D, Hooks} from '@flecks/core';
import {Flecks, spawnWith} from '@flecks/core/server';
import fontLoader from '@neutrinojs/font-loader';
import imageLoader from '@neutrinojs/image-loader';
import styleLoader from '@neutrinojs/style-loader';

import {configSource, inlineConfig} from './config';
import {createHttpServer} from './http';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const debug = D('@flecks/web/server');

export default {
  [Hooks]: {
    '@flecks/core.build': (target, config, flecks) => {
      config.use.push((neutrino) => {
        const isProduction = 'production' === neutrino.config.get('mode');
        const extract = {};
        const style = {};
        if ('server' === target) {
          extract.enabled = false;
          style.injectType = 'lazyStyleTag';
        }
        if ('http' === target) {
          extract.enabled = isProduction;
          style.injectType = 'styleTag';
        }
        if ('fleck' === target) {
          extract.enabled = true;
          extract.plugin = {
            filename: 'index.css',
          };
        }
        neutrino.use(
          styleLoader({
            extract,
            modules: {
              localIdentName: isProduction ? '[hash]' : '[path][name]__[local]',
            },
            style,
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
    '@flecks/core.build.alter': async (neutrinoConfigs, flecks) => {
      // Don't build if there's a fleck target.
      if (neutrinoConfigs.fleck && !flecks.get('@flecks/web/server.forceBuildWithFleck')) {
        // eslint-disable-next-line no-param-reassign
        delete neutrinoConfigs.http;
        return;
      }
      // Only build vendor in dev.
      if (neutrinoConfigs['http-vendor']) {
        if (process.argv.find((arg) => 'production' === arg)) {
          // eslint-disable-next-line no-param-reassign
          delete neutrinoConfigs['http-vendor'];
        }
        // Only build if something actually changed.
        const dll = flecks.get('@flecks/web/server.dll');
        if (dll.length > 0) {
          const manifest = join(
            FLECKS_CORE_ROOT,
            'node_modules',
            '.cache',
            'flecks',
            'http-vendor.manifest.json',
          );
          let timestamp = 0;
          try {
            const stats = await stat(manifest);
            timestamp = stats.mtime;
          }
          // eslint-disable-next-line no-empty
          catch (error) {}
          let latest = 0;
          for (let i = 0; i < dll.length; ++i) {
            const path = dll[i];
            try {
              // eslint-disable-next-line no-await-in-loop
              const stats = await stat(join(FLECKS_CORE_ROOT, 'node_modules', path));
              if (stats.mtime > latest) {
                latest = stats.mtime;
              }
            }
            // eslint-disable-next-line no-empty
            catch (error) {}
          }
          if (timestamp > latest) {
            // eslint-disable-next-line no-param-reassign
            delete neutrinoConfigs['http-vendor'];
          }
          else if (timestamp > 0) {
            await unlink(manifest);
          }
        }
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
       * Modules to externalize using `webpack.DllPlugin`.
       */
      dll: [],
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
        children: false,
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
      flecks.set('$flecks/web.flecks', httpFlecks);
    },
    '@flecks/core.targets': (flecks) => [
      'http',
      ...(flecks.get('@flecks/web/server.dll').length > 0 ? ['http-vendor'] : []),
    ],
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
    '@flecks/repl.context': (flecks) => ({
      httpServer: flecks.get('$flecks/web/server.instance'),
    }),
  },
};
