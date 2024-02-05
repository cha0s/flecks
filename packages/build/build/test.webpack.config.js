const {
  basename,
  dirname,
  extname,
  join,
  relative,
} = require('path');

const {glob} = require('glob');

const configFn = require('./common.webpack.config');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const tests = join(FLECKS_CORE_ROOT, 'test');

module.exports = async (env, argv, flecks) => {
  const config = await configFn(env, argv, flecks);
  config.output.chunkFormat = false;
  config.output.path = join(FLECKS_CORE_ROOT, 'dist', 'test');
  // Test entry.
  const testPaths = await glob(join(tests, '*.js'));
  const {platforms} = flecks;
  testPaths.push(
    ...(await Promise.all(platforms.map((platform) => glob(join(tests, platform, '*.js')))))
      .flat(),
  );
  if (testPaths.length > 0) {
    testPaths.forEach((path) => {
      const entry = relative(tests, path);
      config.entry[join(dirname(entry), basename(entry, extname(entry)))] = [
        'source-map-support/register',
        path,
      ];
    });
  }
  return config;
};
