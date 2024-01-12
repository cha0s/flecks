import {stat, unlink} from 'fs/promises';
import {join} from 'path';

import {D} from '@flecks/core';
import {Flecks, spawnWith} from '@flecks/core/server';

import augmentBuild from './augment-build';
import {configSource, inlineConfig} from './config';
import {createHttpServer} from './http';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const debug = D('@flecks/web/server');

export {augmentBuild, configSource};

export const hooks = {
  '@flecks/core.build': augmentBuild,
  '@flecks/core.build.alter': async (configs, env, argv, flecks) => {
    // Don't build if there's a fleck target.
    if (configs.fleck && !flecks.get('@flecks/web/server.forceBuildWithFleck')) {
      delete configs.web;
      return;
    }
    const isProduction = 'production' === argv.mode;
    // Only build vendor in dev.
    if (configs['web-vendor']) {
      if (isProduction) {
        delete configs['web-vendor'];
      }
      // Only build if something actually changed.
      const dll = flecks.get('@flecks/web/server.dll');
      if (dll.length > 0) {
        const manifest = join(
          FLECKS_CORE_ROOT,
          'node_modules',
          '.cache',
          '@flecks',
          'web',
          'vendor',
          'manifest.json',
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
          delete configs['web-vendor'];
        }
        else if (timestamp > 0) {
          await unlink(manifest);
        }
      }
    }
    // Bail if there's no web build.
    if (!configs.web) {
      return;
    }
    // Bail if the build isn't watching.
    if (!process.argv.find((arg) => '--watch' === arg)) {
      return;
    }
    // Otherwise, spawn `webpack-dev-server` (WDS).
    const cmd = [
      // `npx` doesn't propagate signals!
      // 'npx', 'webpack',
      join(FLECKS_CORE_ROOT, 'node_modules', '.bin', 'webpack'),
      'serve',
      '--mode', 'development',
      '--hot',
      '--config', flecks.buildConfig('fleckspack.config.js'),
    ];
    const child = spawnWith(
      cmd,
      {
        env: {
          FLECKS_CORE_BUILD_LIST: 'web',
        },
      },
    );
    // Clean up on exit.
    process.on('exit', () => {
      child.kill();
    });
    // Remove the build config since we're handing off to WDS.
    delete configs.web;
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
     * The ID of the root element on the page.
     */
    appMountId: 'root',
    /**
     * Base tag path.
     */
    base: '/',
    /**
     * (webpack-dev-server) Disable the host check.
     *
     * See: https://github.com/webpack/webpack-dev-server/issues/887
     */
    devDisableHostCheck: false,
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
     *
     * Defaults to `flecks.get('@flecks/web/server.public')`.
     */
    devPublic: undefined,
    /**
     * (webpack-dev-server) Webpack stats output.
     */
    devStats: {
      colors: true,
      errorDetails: true,
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
     * Path to icon.
     */
    icon: '',
    /**
     * Port to bind.
     */
    port: 32340,
    /**
     * Meta tags.
     */
    meta: {
      charset: 'utf-8',
      viewport: 'width=device-width, user-scalable=no',
    },
    /**
     * Public path to server.
     */
    public: 'localhost:32340',
    /**
     * Webpack stats configuration.
     */
    stats: {
      colors: true,
      errorDetails: true,
    },
    /**
     * HTML title.
     */
    title: '[@flecks/core.id]',
    /**
     * Proxies to trust.
     *
     * See: https://www.npmjs.com/package/proxy-addr
     */
    trust: false,
  }),
  '@flecks/core.mixin': (Flecks) => (
    class FlecksWithWeb extends Flecks {

      web = {
        flecks: undefined,
        server: undefined,
      }

    }
  ),
  '@flecks/core.starting': (flecks) => {
    debug('bootstrapping flecks...');
    const webFlecks = Flecks.bootstrap({
      config: flecks.aliasedConfig,
      platforms: ['client', '!server'],
    });
    debug('bootstrapped');
    flecks.web.flecks = webFlecks;
  },
  '@flecks/core.targets': (flecks) => [
    'web',
    ...(flecks.get('@flecks/web/server.dll').length > 0 ? ['web-vendor'] : []),
  ],
  '@flecks/web.config': async (req, flecks) => ({
    '@flecks/web/client': {
      appMountId: flecks.get('@flecks/web/server.appMountId'),
    },
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
