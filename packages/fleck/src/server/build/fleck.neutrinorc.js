const {join} = require('path');

const {D} = require('@flecks/core');
const {fleck, Flecks} = require('@flecks/core/server');
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

  // Compile.
  const rcBabel = flecks.babel();
  debug('.flecksrc: babel: %O', rcBabel);
  config.use.push(fleck({
    babel: babelmerge(
      {configFile: flecks.buildConfig('babel.config.js')},
      ...rcBabel.map(([, babel]) => babel),
    ),
  }));

  config.use.push(({config}) => {
    config.stats(flecks.get('@flecks/flecks/server.stats'));
  });

  config.use.push(({config}) => {
    // Test entrypoint.
    const testPaths = glob.sync(join(FLECKS_CORE_ROOT, 'test/*.js'));
    for (let i = 0; i < flecks.platforms.length; ++i) {
      testPaths.push(...glob.sync(join(FLECKS_CORE_ROOT, `test/platforms/${flecks.platforms[i]}/*.js`)));
    }
    if (testPaths.length > 0) {
      const testEntry = config.entry('test').clear();
      testPaths.forEach((path) => testEntry.add(path));
    }
  });

  return config;
})();
