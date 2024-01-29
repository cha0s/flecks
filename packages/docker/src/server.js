import startContainer from './start-container';

export const hooks = {
  '@flecks/server.up': async (flecks) => {
    if (!flecks.get('@flecks/docker.enabled')) {
      return;
    }
    const containers = await flecks.invokeMergeUniqueAsync('@flecks/docker.containers');
    await Promise.all(
      Object.entries(containers)
        .map(([key, config]) => startContainer(flecks, key, config)),
    );
  },
};
