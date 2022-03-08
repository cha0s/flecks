const {join} = require('path');

const {D} = require('@flecks/core');
const {Flecks} = require('@flecks/core/server');
const node = require('@neutrinojs/node');
const babelmerge = require('babel-merge');
const glob = require('glob');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const debug = D('@flecks/fleck/fleck.neutrino.js');

const config = require('../../../../core/src/bootstrap/fleck.neutrinorc');

module.exports = (async () => {
  debug('bootstrapping flecks...');
  const flecks = Flecks.bootstrap();
  debug('bootstrapped');

  const compiler = flecks.invokeFleck(
    '@flecks/fleck.compiler',
    flecks.get('@flecks/fleck.compiler'),
  );
  if (compiler) {
    config.use.unshift(compiler);
  }
  else {
    config.use.unshift((neutrino) => {
      neutrino.config.plugins.delete('start-server');
    });
    const configFile = flecks.localConfig('babel.config.js', '@flecks/core');
    config.use.unshift(node({
      babel: {configFile},
      clean: {
        cleanStaleWebpackAssets: false,
      },
    }));
  }

  // Augment the compiler with babel config from flecksrc.
  config.use.push((neutrino) => {
    const rcBabel = flecks.babel();
    debug('.flecksrc: babel: %O', rcBabel);
    neutrino.config.module
      .rule('compile')
      .use('babel')
      .tap((options) => babelmerge(options, ...rcBabel.map(([, babel]) => babel)));
  });

  config.use.push((neutrino) => {
    // Test entrypoint.
    const testPaths = glob.sync(join(FLECKS_CORE_ROOT, 'test/*.js'));
    for (let i = 0; i < flecks.platforms.length; ++i) {
      testPaths.push(...glob.sync(join(FLECKS_CORE_ROOT, `test/platforms/${flecks.platforms[i]}/*.js`)));
    }
    if (testPaths.length > 0) {
      const testEntry = neutrino.config.entry('test').clear();
      testPaths.forEach((path) => testEntry.add(path));
    }
  });

  return config;
})();
