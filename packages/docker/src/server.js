import {Hooks} from '@flecks/core';

import commands from './commands';
import startContainer from './start-container';

export default {
  [Hooks]: {
    '@flecks/core/config': () => ({
      enabled: true,
    }),
    '@flecks/core/commands': commands,
    '@flecks/server/up': async (flecks) => {
      if (!flecks.get('@flecks/docker/server.enabled')) {
        return;
      }
      const containers = await flecks.invokeReduceAsync('@flecks/docker/containers');
      await Promise.all(
        Object.entries(containers)
          .map(([key, config]) => startContainer(flecks, key, config)),
      );
    },
  },
};
