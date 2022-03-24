const {spawnSync} = require('child_process');
const {
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} = require('fs');
const {join} = require('path');

const neutrino = require('neutrino');

const R = require('../../bootstrap/require');
const D = require('../../debug');
const {targetNeutrino, targetNeutrinos} = require('../commands');
const {default: Flecks} = require('../flecks');

const debug = D('@flecks/core/.eslintrc.js');

const {
  FLECKS_CORE_BUILD_TARGET = 'fleck',
  FLECKS_CORE_ROOT = process.cwd(),
  FLECKS_CORE_SYNC_FOR_ESLINT = false,
} = process.env;

if (FLECKS_CORE_SYNC_FOR_ESLINT) {
  (async () => {
    debug('bootstrapping flecks...');
    const flecks = Flecks.bootstrap();
    debug('bootstrapped');
    const neutrinos = targetNeutrinos(flecks);
    const config = neutrinos[targetNeutrino(FLECKS_CORE_BUILD_TARGET)]
      ? await R(neutrinos[targetNeutrino(FLECKS_CORE_BUILD_TARGET)])(flecks)
      // eslint-disable-next-line global-require
      : require('../../bootstrap/fleck.neutrinorc');
    flecks.invokeFlat('@flecks/core.build', FLECKS_CORE_BUILD_TARGET, config);
    const eslintConfig = neutrino(config).eslintrc();
    const webpackConfig = neutrino(config).webpack();
    eslintConfig.settings['import/resolver'].webpack = {
      config: {
        resolve: webpackConfig.resolve,
      },
    };
    process.stdout.write(JSON.stringify(eslintConfig, null, 2));
  })();
}
else {
  const cacheDirectory = join(FLECKS_CORE_ROOT, 'node_modules', '.cache', 'flecks');
  try {
    statSync(join(cacheDirectory, 'eslintrc.json'));
    module.exports = JSON.parse(readFileSync(join(cacheDirectory, 'eslintrc.json')).toString());
  }
  catch (error) {
    const {stderr, stdout} = spawnSync('node', [__filename], {
      env: {
        FLECKS_CORE_SYNC_FOR_ESLINT: true,
        ...process.env,
      },
    });
    // eslint-disable-next-line no-console
    console.error(stderr.toString());
    const json = stdout.toString();
    try {
      statSync(join(FLECKS_CORE_ROOT, 'node_modules'));
      mkdirSync(cacheDirectory, {recursive: true});
      writeFileSync(join(cacheDirectory, 'eslintrc.json'), json);
    }
    // eslint-disable-next-line no-empty
    catch (error) {}
    module.exports = JSON.parse(json);
  }
}
