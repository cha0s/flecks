const {join} = require('path');

const webpack = require('webpack');

const {ProcessAssets} = require('../../process-assets');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

exports.hook = async (target, config, env, argv, flecks) => {
  if (flecks.get('@flecks/build.profile').includes(target)) {
    config.plugins.push(
      new webpack.debug.ProfilingPlugin({
        outputPath: join(FLECKS_CORE_ROOT, `profile.build-${target}.json`),
      }),
    );
  }
  if (flecks.roots.some(([path, request]) => path !== request)) {
    config.resolve.symlinks = false;
  }
  config.plugins.push(new ProcessAssets(target, flecks));
};
