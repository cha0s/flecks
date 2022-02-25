import {Hooks} from '@flecks/core';
import react from '@neutrinojs/react';

import ssr from './ssr';

export default {
  [Hooks]: {
    '@flecks/http/server/compiler': (flecks) => (
      react({
        clean: false,
        hot: false,
        html: {
          inject: false,
          template: flecks.localConfig('template.ejs', '@flecks/http'),
        },
        style: {
          extract: {
            enabled: false,
          },
          style: {
            injectType: 'lazyStyleTag',
          },
        },
      })
    ),
    '@flecks/http/server/stream.html': (stream, req, flecks) => (
      flecks.get('@flecks/react.ssr') ? ssr(stream, req, flecks) : stream
    ),
  },
};
