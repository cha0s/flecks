import {Flecks} from '@flecks/core';
import {augmentBuild} from '@flecks/web/server';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import ssr from './ssr';

export const hooks = {
  '@flecks/core.build': (target, config, env, argv, flecks) => {
    const isProduction = 'production' === argv.mode;
    if (!isProduction) {
      config.plugins.push(new ReactRefreshWebpackPlugin());
    }
    // Augment the build on behalf of a missing `@flecks/web`.
    if (!flecks.fleck('@flecks/web/server')) {
      flecks.registerBuildConfig('postcss.config.js', {fleck: '@flecks/web/server'});
      flecks.registerResolver('@flecks/web');
      augmentBuild(target, config, env, argv, flecks);
    }
  },
  '@flecks/web/server.stream.html': Flecks.priority(
    (stream, req, flecks) => (
      flecks.get('@flecks/react.ssr') ? ssr(stream, req, flecks) : stream
    ),
    {after: '@flecks/web/server'},
  ),
};
