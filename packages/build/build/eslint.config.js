const {spawnSync} = require('child_process');
const {
  mkdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} = require('fs');
const {join} = require('path');

const D = require('@flecks/core/build/debug');

const Build = require('./build');

const debug = D('@flecks/build/build/eslint.config.js');

const {
  FLECKS_BUILD_ESLINT_NO_CACHE,
  FLECKS_CORE_ROOT = process.cwd(),
  FLECKS_CORE_SYNC_FOR_ESLINT = false,
} = process.env;

// This is kinda nuts, but ESLint doesn't support its configuration files returning a promise!
if (FLECKS_CORE_SYNC_FOR_ESLINT) {
  (async () => {
    debug('bootstrapping flecks...');
    const flecks = await Build.from();
    debug('bootstrapped');
    // Load and finalize ESLint configuration.
    const eslintConfigPath = await flecks.resolveBuildConfig('default.eslint.config.js');
    const eslintConfig = await require(eslintConfigPath)(flecks);
    // Load build configuration.
    const [env, argv] = [{}, {mode: 'development'}];
    const webpackConfigPath = await flecks.resolveBuildConfig('fleck.webpack.config.js');
    const webpackConfigs = {
      fleck: await require(webpackConfigPath)(env, argv, flecks),
    };
    await flecks.configureBuilds(webpackConfigs, env, argv);
    const {resolve} = webpackConfigs.fleck;
    eslintConfig.settings['import/resolver'].webpack = {config: {resolve}};
    // Write it out to stdout.
    process.stdout.write(JSON.stringify(eslintConfig, null, 2));
  })();
}
else {
  // Check cache first.
  const cacheDirectory = join(FLECKS_CORE_ROOT, 'node_modules', '.cache', '@flecks', 'build');
  try {
    if (FLECKS_BUILD_ESLINT_NO_CACHE) {
      throw new Error();
    }
    statSync(join(cacheDirectory, 'eslint.config.json'));
    module.exports = JSON.parse(readFileSync(join(cacheDirectory, 'eslint.config.json')).toString());
  }
  catch (error) {
    // Just silly. By synchronously spawning... ourselves, the child can use async.
    const {stderr, stdout} = spawnSync('node', [__filename], {
      env: {
        FLECKS_CORE_SYNC_FOR_ESLINT: true,
        NODE_PATH: join(FLECKS_CORE_ROOT, 'node_modules'),
        ...process.env,
      },
    });
    const stderrString = stderr.toString();
    if (stderrString) {
      // eslint-disable-next-line no-console
      console.error(stderrString);
    }
    // Read the JSON written out to stdout.
    const json = stdout.toString();
    try {
      const parsed = JSON.parse(json);
      mkdirSync(cacheDirectory, {recursive: true});
      // Cache.
      writeFileSync(join(cacheDirectory, 'eslint.config.json'), json);
      module.exports = parsed;
    }
    catch (error) {
      if (error.message.match(/Unexpected .*? in JSON/)) {
        // eslint-disable-next-line no-console
        console.error('Expected JSON, got:\n%s', json);
      }
      else {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  }
}
