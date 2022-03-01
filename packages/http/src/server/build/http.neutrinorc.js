const {D} = require('@flecks/core');
const {Flecks} = require('@flecks/core/server');
const web = require('@neutrinojs/web');
const {EnvironmentPlugin} = require('webpack');

const devServer = require('./dev-server');
const outputs = require('./outputs');
const runtime = require('./runtime');
const targets = require('./targets');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const debug = D('@flecks/http/http.neutrino.js');

module.exports = (async () => {
  debug('bootstrapping flecks...');
  const flecks = Flecks.bootstrap();
  debug('bootstrapped');
  // Neutrino configuration.
  const config = {
    options: {
      output: 'dist',
      root: FLECKS_CORE_ROOT,
    },
    use: [
      ({config}) => {
        config
          .plugin('environment')
          .use(EnvironmentPlugin, [{
            FLECKS_CORE_BUILD_TARGET: 'client',
          }]);
      },
      await targets(flecks),
    ],
  };
  // Compile code.
  const compiler = flecks.invokeFleck(
    '@flecks/http/server/compiler',
    flecks.get('@flecks/http/server.compiler'),
  );
  if (compiler) {
    config.use.push(compiler);
  }
  else {
    // Use neutrino's web middleware by default.
    config.use.push(web({
      clean: false,
      hot: false,
      html: {
        inject: false,
        template: flecks.localConfig('template.ejs', '@flecks/http'),
      },
      style: {
        extract: {
          enabled: false,
        },
        style: {
          injectType: 'lazyStyleTag',
        },
      },
    }));
  }
  // Configure dev server.
  config.use.push(devServer(flecks));
  // Build the client runtime.
  config.use.push(await runtime(flecks));
  // Output configuration.
  config.use.push(outputs());
  return config;
})();
