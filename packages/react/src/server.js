import {Flecks} from '@flecks/core';

import ssr from './ssr';

export const hooks = {
  '@flecks/web/server.stream.html': Flecks.priority(
    (stream, req, flecks) => (
      flecks.get('@flecks/react.ssr') ? ssr(stream, req, flecks) : stream
    ),
    {after: '@flecks/web/server'},
  ),
};
