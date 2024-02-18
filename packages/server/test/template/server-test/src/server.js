import {Flecks} from '@flecks/core';

export const hooks = {
  '@flecks/core.reload': (fleck, config) => {
    if ('server-test' === fleck && 'fail' === config.foo) {
      throw new Error();
    }
  },
  '@flecks/core.hmr': Flecks.priority(
    async (path, M, flecks) => {
      const {socket} = flecks.server;
      socket.write(JSON.stringify({
        type: 'hmr',
        payload: path,
      }));
    },
    {after: '@flecks/core'},
  ),
};
