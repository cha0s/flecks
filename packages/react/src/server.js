import {augmentBuild} from '@flecks/web/server';

import ssr from './ssr';

export const hooks = {
  '@flecks/core.build': (target, config, env, argv, flecks) => {
    const isProduction = 'production' === argv.mode;
    config.resolve.alias['react-native'] = 'react-native-web';
    config.resolve.alias['react-hot-loader'] = isProduction
      ? 'react-hot-loader/dist/react-hot-loader.production'
      : 'react-hot-loader/dist/react-hot-loader.development';
    config.resolve.extensions.unshift(...['.web.js', '.web.jsx']);
    // Augment the build on behalf of a missing `@flecks/web`.
    if (!flecks.fleck('@flecks/web/server')) {
      flecks.registerBuildConfig('postcss.config.js', {fleck: '@flecks/web/server'});
      flecks.registerResolver('@flecks/web');
      augmentBuild(target, config, env, argv, flecks);
    }
  },
  '@flecks/web/server.stream.html': (stream, req, flecks) => (
    flecks.get('@flecks/react.ssr') ? ssr(stream, req, flecks) : stream
  ),
};
