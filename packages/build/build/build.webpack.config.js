const Build = require('./build');
const configFn = require('./fleck.webpack.config');
const {ProcessAssets, processFleckAssets} = require('./process-assets');
const {executable} = require('./webpack');

module.exports = async (env, argv) => {
  const flecks = await Build.from();
  const config = await configFn(env, argv, flecks);
  config.plugins.push(new ProcessAssets('fleck', flecks));
  // Small hack because internals.
  flecks.hooks['@flecks/build.processAssets'] = [{
    fleck: '@flecks/build',
    fn: (target, assets, compilation) => processFleckAssets(assets, compilation),
  }];
  config.plugins.push(executable());
  return config;
};
