const Build = require('../../build/build/build');
const configFn = require('../../build/build/fleck.webpack.config');
const {ProcessAssets, processFleckAssets} = require('../../build/build/process-assets');

module.exports = async (env, argv) => {
  const flecks = await Build.from();
  const config = await configFn(env, argv, flecks);
  config.plugins.push(new ProcessAssets('fleck', flecks));
  // Small hack because internals.
  flecks.hooks['@flecks/build.processAssets'] = [{
    hook: '@flecks/build',
    fn: (target, assets, compilation) => processFleckAssets(assets, compilation),
  }];
  return config;
};
