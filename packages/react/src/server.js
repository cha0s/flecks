import {Hooks} from '@flecks/core';
import {augmentBuild} from '@flecks/web/server';

import ssr from './ssr';

export default {
  [Hooks]: {
    '@flecks/core.build': (target, config, flecks) => {
      // Resolution.
      config.use.push(({config}) => {
        config.resolve.alias
          .set('react-native', 'react-native-web');
        config.resolve.extensions
          .prepend('.web.js')
          .prepend('.web.jsx');
      });
      // Augment the build on behalf of a missing `@flecks/web`.
      if (!flecks.fleck('@flecks/web/server')) {
        flecks.registerBuildConfig('postcss.config.js', {fleck: '@flecks/web/server'});
        flecks.registerResolver('@flecks/web');
        augmentBuild(target, config, flecks);
      }
    },
    '@flecks/web/server.stream.html': (stream, req, flecks) => (
      flecks.get('@flecks/react.ssr') ? ssr(stream, req, flecks) : stream
    ),
  },
};
