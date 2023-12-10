import commands from './commands';
import FlecksDockerOutput from './plugin';
import startContainer from './start-container';

export const hooks = {
  '@flecks/core.build': (target, config, env, argv, flecks) => {
    if ('server' !== target) {
      return;
    }
    config.plugins.push(new FlecksDockerOutput({flecks}));
  },
  '@flecks/core.config': () => ({
    /**
     * Whether to run docker containers.
     */
    enabled: true,
  }),
  '@flecks/core.commands': commands,
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
