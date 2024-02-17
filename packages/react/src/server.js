import {Flecks} from '@flecks/core';

import ssr from './ssr';

export const hooks = {
  '@flecks/electron/server.extensions': (installer) => [installer.REACT_DEVELOPER_TOOLS],
  '@flecks/web/server.stream.html': Flecks.priority(
    (stream, req, res, flecks) => (
      flecks.get('@flecks/react.ssr') ? ssr(stream, req, flecks) : stream
    ),
    {after: '@flecks/web/server'},
  ),
};
