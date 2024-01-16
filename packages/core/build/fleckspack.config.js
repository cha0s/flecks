require('source-map-support/register');

const D = require('./debug');
const Server = require('./server');

const debug = D('@flecks/core/build/fleckspack.config.js');

const {
  FLECKS_CORE_BUILD_LIST = '',
} = process.env;

const buildList = FLECKS_CORE_BUILD_LIST
  .split(',')
  .map((name) => name.trim())
  .filter((e) => e);

module.exports = async (env, argv) => {
  debug('bootstrapping flecks...');
  const flecks = await Server.from();
  debug('bootstrapped');
  debug('gathering configs');
  const {targets} = flecks;
  const building = targets
    .filter(([, target]) => 0 === buildList.length || buildList.includes(target));
  debug('building: %O', building.map(([target]) => target));
  if (0 === building.length) {
    debug('no build configuration found! aborting...');
    await new Promise(() => {});
  }
  const entries = await Promise.all(building.map(
    async ([fleck, target]) => {
      const configFn = require(await flecks.resolveBuildConfig(`${target}.webpack.config.js`, fleck));
      if ('function' !== typeof configFn) {
        debug(`'${
          target
        }' build configuration expected function got ${
          typeof configFn
        }! aborting...`);
        return undefined;
      }
      return [target, await configFn(env, argv, flecks)];
    },
  ));
  await Promise.all(
    entries.map(async ([target, config]) => (
      Promise.all(flecks.invokeFlat('@flecks/core.build', target, config, env, argv))
    )),
  );
  const webpackConfigs = Object.fromEntries(entries);
  await Promise.all(flecks.invokeFlat('@flecks/core.build.alter', webpackConfigs, env, argv));
  const enterableWebpackConfigs = Object.values(webpackConfigs)
    .filter((webpackConfig) => {
      if (!webpackConfig.entry) {
        debug('webpack configurations %O had no entry... discarding', webpackConfig);
        return false;
      }
      return true;
    });
  if (0 === enterableWebpackConfigs.length) {
    debug('no webpack configuration found! aborting...');
    await new Promise(() => {});
  }
  debug('webpack configurations %O', enterableWebpackConfigs);
  return enterableWebpackConfigs;
};
