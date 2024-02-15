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
  FLECKS_CORE_TEST_SUBDIRECTORIES,
} = process.env;

const tests = join(FLECKS_CORE_ROOT, 'test');

module.exports = async (env, argv, flecks) => {
  const config = await configFn(env, argv, flecks);
  config.output.chunkFormat = false;
  config.output.path = join(FLECKS_CORE_ROOT, 'dist', 'test');
  const testPaths = [];
  const subdirectories = JSON.parse(FLECKS_CORE_TEST_SUBDIRECTORIES);
  testPaths.push(
    ...(await Promise.all(
      subdirectories
        .filter((subdirectory) => 'default' !== subdirectory)
        .map((subdirectory) => glob(join(tests, subdirectory, '*.js'))),
    ))
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
