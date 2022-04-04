/* eslint-disable import/first */
import 'source-map-support/register';

if ('production' !== process.env.NODE_ENV) {
  try {
    // eslint-disable-next-line global-require, import/no-unresolved
    require('dotenv/config');
  }
  // eslint-disable-next-line no-empty
  catch (error) {}
}

import flatten from 'lodash.flatten';
import intersection from 'lodash.intersection';
import neutrino from 'neutrino';

import D from '../../debug';
import {targetNeutrino} from '../commands';
import Flecks from '../flecks';

const debug = D('@flecks/core/build/webpack.config.js');
const debugSilly = debug.extend('silly');

const {
  FLECKS_CORE_BUILD_LIST = '',
} = process.env;

const buildList = FLECKS_CORE_BUILD_LIST
  .split(',')
  .map((name) => name.trim())
  .filter((e) => e);

export default (async () => {
  debug('bootstrapping flecks...');
  const flecks = Flecks.bootstrap();
  debug('bootstrapped');

  debug('gathering configs');
  let targets = flatten(flecks.invokeFlat('@flecks/core.targets'));
  if (buildList.length > 0) {
    targets = intersection(targets, buildList);
  }
  debug('building: %O', targets);
  if (0 === targets.length) {
    debug('no build configuration found! aborting...');
    await new Promise(() => {});
  }
  const entries = await Promise.all(targets.map(
    async (target) => [
      target,
      await __non_webpack_require__(process.env[targetNeutrino(target)])(flecks),
    ],
  ));
  await Promise.all(
    entries.map(async ([target, config]) => (
      flecks.invokeFlat('@flecks/core.build', target, config)
    )),
  );
  const neutrinoConfigs = Object.fromEntries(entries);
  await Promise.all(flecks.invokeFlat('@flecks/core.build.alter', neutrinoConfigs));
  const webpackConfigs = (
    await Promise.all(
      Object.entries(neutrinoConfigs)
        .map(async ([target, config]) => {
          const webpackConfig = neutrino(config).webpack();
          await flecks.invokeFlat('@flecks/core.webpack', target, webpackConfig);
          return webpackConfig;
        }),
    )
  )
    .filter((webpackConfig) => {
      if (!webpackConfig.entry) {
        debug('webpack configurations %O had no entry... discarding', webpackConfig);
        return false;
      }
      return true;
    });
  if (0 === webpackConfigs.length) {
    debug('no webpack configuration found! aborting...');
    await new Promise(() => {});
  }
  debugSilly('webpack configurations %O', webpackConfigs);
  return webpackConfigs;
})();
