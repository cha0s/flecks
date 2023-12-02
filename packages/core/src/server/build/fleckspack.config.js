/* eslint-disable import/first */
import 'source-map-support/register';

if ('production' !== process.env.NODE_ENV) {
  try {
    // eslint-disable-next-line global-require, import/no-unresolved
    __non_webpack_require__('dotenv/config');
  }
  // eslint-disable-next-line no-empty
  catch (error) {}
}

import intersectionBy from 'lodash.intersectionby';

import D from '../../debug';
import Flecks from '../flecks';

const debug = D('@flecks/core/server/build/fleckspack.config.js');

const {
  FLECKS_CORE_BUILD_LIST = '',
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const buildList = FLECKS_CORE_BUILD_LIST
  .split(',')
  .map((name) => name.trim())
  .filter((e) => e);

export default async (env, argv) => {
  debug('bootstrapping flecks...');
  const flecks = Flecks.bootstrap();
  debug('bootstrapped');

  debug('gathering configs');
  const targets = [];
  Object.entries(flecks.invoke('@flecks/core.targets'))
    .forEach(([fleck, fleckTargets]) => {
      intersectionBy(fleckTargets, buildList.length ? buildList : fleckTargets)
        .forEach((target) => {
          targets.push([target, fleck]);
        });
    });
  debug('building: %O', targets.map(([target]) => target));
  if (0 === targets.length) {
    debug('no build configuration found! aborting...');
    await new Promise(() => {});
  }
  const entries = await Promise.all(targets.map(
    async ([target, fleck]) => {
      const buildConfig = flecks.resolveBuildConfig(
        [
          FLECKS_CORE_ROOT,
          flecks.resolvePath(fleck),
        ],
        [
          `${target}.webpack.config.js`,
          'webpack.config.js',
        ],
      );
      const configFn = __non_webpack_require__(buildConfig);
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
      flecks.invokeFlat('@flecks/core.build', target, config, env, argv)
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
