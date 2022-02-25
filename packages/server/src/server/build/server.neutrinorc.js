const {join} = require('path');

const {Flecks} = require('@flecks/core/server');
const banner = require('@neutrinojs/banner');
const node = require('@neutrinojs/node');
const startServer = require('@neutrinojs/start-server');
const D = require('debug');

const runtime = require('./runtime');

const {
  FLECKS_HOT = false,
  FLECKS_INSPECT = false,
  FLECKS_PROFILE = false,
  FLECKS_ROOT = process.cwd(),
  FLECKS_START_SERVER = false,
} = process.env;

const debug = D('@flecks/server/server.neutrino.js');

debug('bootstrapping flecks...');
const flecks = Flecks.bootstrap();
debug('bootstrapped');

const entry = (neutrino) => {
  const entries = neutrino.config.entry('index');
  entries.delete(join(FLECKS_ROOT, 'src', 'index'));
  entries.add('@flecks/server/entry');
};

// Augment the application-starting configuration.
const start = (neutrino) => {
  if (FLECKS_START_SERVER) {
    neutrino.use(startServer({name: 'index.js'}));
  }
  if (!neutrino.config.plugins.has('start-server')) {
    return;
  }
  neutrino.config
    .plugin('start-server')
    .tap((args) => {
      const options = args[0];
      options.keyboard = false;
      // HMR.
      options.signal = true;
      // Debugging.
      if (FLECKS_INSPECT) {
        options.nodeArgs.push('--inspect');
      }
      // Profiling.
      if (FLECKS_PROFILE) {
        options.nodeArgs.push('--prof');
      }
      // Bail hard on unhandled rejections and report.
      options.nodeArgs.push('--unhandled-rejections=strict');
      options.nodeArgs.push('--trace-uncaught');
      return args;
    });
};

const compiler = flecks.invokeFleck(
  '@flecks/server/compiler',
  flecks.get('@flecks/server.compiler'),
);

const config = {
  options: {
    output: 'dist',
    root: FLECKS_ROOT,
  },
  use: [
    entry,
    start,
  ],
};

if (compiler) {
  config.use.unshift(compiler);
}
else {
  config.use.unshift((neutrino) => {
    // Default to not starting application on build.
    neutrino.config.plugins.delete('start-server');
  });
  config.use.unshift(node({
    clean: false,
    hot: FLECKS_HOT,
  }));
}
// Stub out non-server-friendly modules on the server.
const stubs = flecks.stubs();
if (stubs.length > 0) {
  config.use.unshift(({config}) => {
    stubs.forEach((path) => {
      config.resolve.alias
        .set(path, '@flecks/core/empty');
    });
  });
}
// Hardcore hax for module aliasing.
const aliases = flecks.aliases();
if (Object.keys(aliases).length > 0) {
  const code = [
    `const aliases = ${JSON.stringify(aliases)};`,
    'const {Module} = require("module");',
    'const {require: Mr} = Module.prototype;',
    'Module.prototype.require = function hackedRequire(request, options) {',
    '  if (aliases[request]) {',
    '    return Mr.call(this, aliases[request], options);',
    '  }',
    '  return Mr.call(this, request, options);',
    '};',
  ].join('\n');
  config.use.push(banner({
    banner: code,
    pluginId: 'aliases-banner',
  }));
}

// Build the server runtime.
config.use.push(runtime(flecks));

// Give the resolver a helping hand.
config.use.push((neutrino) => {
  neutrino.config.resolve.modules.merge([
    join(FLECKS_ROOT, 'node_modules'),
    'node_modules',
  ]);
});

module.exports = config;
