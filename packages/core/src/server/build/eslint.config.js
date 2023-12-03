const {spawnSync} = require('child_process');
const {
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} = require('fs');
const {join} = require('path');

const D = require('../../debug');
const {default: Flecks} = require('../flecks');

const debug = D('@flecks/core/server/build/eslint.config.js');

const {
  FLECKS_CORE_ROOT = process.cwd(),
  FLECKS_CORE_SYNC_FOR_ESLINT = false,
} = process.env;

// This is kinda nuts, but ESLint doesn't support its configuration files returning a promise!
if (FLECKS_CORE_SYNC_FOR_ESLINT) {
  (async () => {
    debug('bootstrapping flecks...');
    const flecks = Flecks.bootstrap();
    debug('bootstrapped');
    const eslintConfigFn = __non_webpack_require__(flecks.buildConfig('default.eslint.config.js'));
    const eslintConfig = await eslintConfigFn(flecks);
    const webpackConfigFn = __non_webpack_require__(flecks.buildConfig('webpack.config.js', 'fleck'));
    const webpackConfig = await webpackConfigFn({}, {mode: 'development'}, flecks);
    eslintConfig.settings['import/resolver'].webpack = {
      config: {
        resolve: webpackConfig.resolve,
      },
    };
    process.stdout.write(JSON.stringify(eslintConfig, null, 2));
  })();
}
else {
  const cacheDirectory = join(FLECKS_CORE_ROOT, 'node_modules', '.cache', '@flecks', 'core');
  try {
    statSync(join(cacheDirectory, 'eslint.config.json'));
    module.exports = JSON.parse(readFileSync(join(cacheDirectory, 'eslint.config.json')).toString());
  }
  catch (error) {
    // Just silly. By synchronously spawning... ourselves, the spawned copy can use async.
    const {stderr, stdout} = spawnSync('node', [__filename], {
      env: {
        FLECKS_CORE_SYNC_FOR_ESLINT: true,
        NODE_PATH: join(FLECKS_CORE_ROOT, 'node_modules'),
        ...process.env,
      },
    });
    // eslint-disable-next-line no-console
    console.error(stderr.toString());
    const json = stdout.toString();
    try {
      statSync(join(FLECKS_CORE_ROOT, 'node_modules'));
      mkdirSync(cacheDirectory, {recursive: true});
      writeFileSync(join(cacheDirectory, 'eslint.config.json'), json);
    }
    // eslint-disable-next-line no-empty
    catch (error) {}
    module.exports = JSON.parse(json);
  }
}
