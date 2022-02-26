const {join} = require('path');

const {Flecks} = require('@flecks/core/server');
const node = require('@neutrinojs/node');
const D = require('debug');
const glob = require('glob');

const {
  FLECKS_ROOT = process.cwd(),
} = process.env;

const debug = D('@flecks/fleck/fleck.neutrino.js');

debug('bootstrapping flecks...');
const flecks = Flecks.bootstrap();
debug('bootstrapped');

const config = require('../../../../core/src/bootstrap/fleck.neutrinorc');

const compiler = flecks.invokeFleck(
  '@flecks/fleck/compiler',
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
  }));
}

config.use.push((neutrino) => {
  // Test entrypoint.
  const testPaths = glob.sync(join(FLECKS_ROOT, 'test/*.js'));
  for (let i = 0; i < this.platforms.length; ++i) {
    testPaths.push(...glob.sync(join(FLECKS_ROOT, `test/platforms/${this.platforms[i]}/*.js`)));
  }
  if (testPaths.length > 0) {
    const testEntry = neutrino.config.entry('test').clear();
    testPaths.forEach((path) => testEntry.add(path));
  }
});

module.exports = config;
