export const hooks = {
  '@flecks/core.reload': (fleck, config) => {
    if ('comm' === fleck && 'fail' === config.foo) {
      throw new Error();
    }
  },
  '@flecks/core.hmr': async (path, M, flecks) => {
    const {socket} = flecks.server;
    socket.write(JSON.stringify({
      type: 'hmr',
      payload: path,
    }));
  },
};
