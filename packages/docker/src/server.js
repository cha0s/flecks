import {Hooks} from '@flecks/core';

import startContainer from './start-container';

export default {
  [Hooks]: {
    '@flecks/server/up': async (flecks) => {
      const containers = await flecks.invokeReduceAsync('@flecks/docker/containers');
      await Promise.all(
        Object.entries(containers)
          .map(([key, config]) => startContainer(flecks, key, config)),
      );
    },
  },
};
