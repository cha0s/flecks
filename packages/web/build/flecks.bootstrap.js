const {stat, unlink} = require('fs/promises');
const {join} = require('path');

const Build = require('@flecks/build/build/build');
const {regexFromExtensions} = require('@flecks/build/server');
const {spawnWith} = require('@flecks/core/server');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

exports.hooks = {
  '@flecks/build.config': async (target, config, env, argv, flecks) => {
    const isProduction = 'production' === argv.mode;
    let finalLoader;
    switch (target) {
      case 'fleck': {
        finalLoader = {loader: MiniCssExtractPlugin.loader};
        config.plugins.push(new MiniCssExtractPlugin({filename: 'assets/[name].css'}));
        break;
      }
      case 'server': {
        finalLoader = {loader: MiniCssExtractPlugin.loader, options: {emit: false}};
        config.plugins.push(new MiniCssExtractPlugin({filename: 'assets/[name].css'}));
        break;
      }
      case 'web': {
        if (isProduction) {
          finalLoader = {loader: MiniCssExtractPlugin.loader};
          config.plugins.push(new MiniCssExtractPlugin({filename: 'assets/[name].css'}));
        }
        else {
          finalLoader = {loader: 'style-loader'};
        }
        break;
      }
      default: break;
    }
    const buildOneOf = (test, loaders, cssOptions = {}) => ({
      test,
      use: [
        finalLoader,
        {
          loader: 'css-loader',
          options: {
            ...cssOptions,
            importLoaders: loaders.length,
          },
        },
        ...loaders,
        'source-map-loader',
      ],
    });
    const stylesWithModulesRule = (extensions, loaders) => ({
      oneOf: [
        // `.module.*` must match first.
        buildOneOf(
          regexFromExtensions(extensions.map((ext) => `module${ext}`)),
          loaders,
          {
            modules: {
              localIdentName: isProduction
                ? '[hash:base64:5]'
                : '[path][name]__[local]',
            },
          },
        ),
        buildOneOf(
          regexFromExtensions(extensions),
          loaders,
        ),
      ],
    });
    const postcss = {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          config: await flecks.resolveBuildConfig('postcss.config.js'),
        },
      },
    };
    // Originally separated because Sass can't handle incoming source maps, but probably more
    // performant with 3rd-party CSS anyway.
    config.module.rules.push(stylesWithModulesRule(['.css'], [postcss]));
    config.module.rules.push(stylesWithModulesRule(['.sass', '.scss'], [postcss, 'sass-loader']));
    // Fonts.
    if (isProduction) {
      config.module.rules.push({
        generator: {
          filename: 'assets/[hash][ext][query]',
        },
        test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset',
      });
    }
    else {
      config.module.rules.push({
        test: /\.(eot|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        type: 'asset/inline',
      });
    }
    // Images.
    config.module.rules.push({
      generator: {
        filename: 'assets/[hash][ext][query]',
      },
      test: /\.(ico|png|jpg|jpeg|gif|svg|webp)(\?v=\d+\.\d+\.\d+)?$/,
      type: 'asset',
    });
  },
  '@flecks/build.config.alter': async (configs, env, argv, flecks) => {
    const isProduction = 'production' === argv.mode;
    // Only build vendor in dev.
    if (configs['web-vendor']) {
      if (isProduction) {
        delete configs['web-vendor'];
      }
      // Only build if something actually changed.
      const dll = flecks.get('@flecks/web.dll');
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
      '--config', await flecks.resolveBuildConfig('fleckspack.config.js'),
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
  '@flecks/build.files': () => [
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
    /**
     * Web client build configuration. See: https://webpack.js.org/configuration/
     */
    'web.webpack.config.js',
    /**
     * Web vendor DLL build configuration. See: https://webpack.js.org/configuration/
     */
    'web-vendor.webpack.config.js',
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
     * Defaults to `flecks.get('@flecks/web.public')`.
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
  '@flecks/build.targets': (flecks) => [
    'web',
    ...(flecks.get('@flecks/web.dll').length > 0 ? ['web-vendor'] : []),
  ],
  '@flecks/build.targets.alter': (targets) => {
    // Don't build if there's a fleck target.
    if (targets.has('fleck')) {
      targets.delete('web');
    }
  },
  '@flecks/fleck.packageJson': (json, compilation) => {
    if (Object.keys(compilation.assets).some((filename) => filename.match(/^assets\//))) {
      json.files.push('assets');
    }
  },
  '@flecks/server.runtime': async (flecks) => {
    const {config} = await Build.from({
      config: flecks.config,
      platforms: ['client', '!server'],
    });
    return JSON.stringify(config);
  },
};
