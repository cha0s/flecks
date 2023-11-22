import {augmentBuild} from '@flecks/web/server';

import ssr from './ssr';

export const hooks = {
  /* eslint-disable no-param-reassign */
  '@flecks/core.build': (target, config, env, argv, flecks) => {
    config.resolve.alias['react-native'] = 'react-native-web';
    config.resolve.extensions.unshift(...['.web.js', '.web.jsx']);
    // Augment the build on behalf of a missing `@flecks/web`.
    if (!flecks.fleck('@flecks/web/server')) {
      flecks.registerBuildConfig('postcss.config.js', {fleck: '@flecks/web/server'});
      flecks.registerResolver('@flecks/web');
      augmentBuild(target, config, env, argv, flecks);
    }
  },
  /* eslint-enable no-param-reassign */
  '@flecks/web/server.stream.html': (stream, req, flecks) => (
    flecks.get('@flecks/react.ssr') ? ssr(stream, req, flecks) : stream
  ),
};
