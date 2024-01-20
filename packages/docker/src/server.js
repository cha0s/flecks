import startContainer from './start-container';

export const hooks = {
  '@flecks/server.up': async (flecks) => {
    if (!flecks.get('@flecks/docker/server.enabled')) {
      return;
    }
    const containers = await flecks.invokeMergeAsync('@flecks/docker.containers');
    await Promise.all(
      Object.entries(containers)
        .map(([key, config]) => startContainer(flecks, key, config)),
    );
  },
};
