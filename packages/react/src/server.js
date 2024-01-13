import {Flecks} from '@flecks/core';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import ssr from './ssr';

export const hooks = {
  '@flecks/core.build': (target, config, env, argv) => {
    const isProduction = 'production' === argv.mode;
    if (!isProduction) {
      config.plugins.push(new ReactRefreshWebpackPlugin());
    }
  },
  '@flecks/web/server.stream.html': Flecks.priority(
    (stream, req, flecks) => (
      flecks.get('@flecks/react.ssr') ? ssr(stream, req, flecks) : stream
    ),
    {after: '@flecks/web/server'},
  ),
};
