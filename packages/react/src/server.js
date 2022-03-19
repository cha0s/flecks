import {Hooks} from '@flecks/core';

import ssr from './ssr';

export default {
  [Hooks]: {
    '@flecks/core.build': (target, config) => {
      // Resolution.
      config.use.push(({config}) => {
        config.resolve.alias
          .set('react-native', 'react-native-web');
        config.resolve.extensions
          .prepend('.web.js')
          .prepend('.web.jsx');
      });
    },
    '@flecks/web/server.stream.html': (stream, req, flecks) => (
      flecks.get('@flecks/react.ssr') ? ssr(stream, req, flecks) : stream
    ),
  },
};
