export const hooks = {
  /**
   * Define docker containers.
   *
   * Beware: the user running the server must have Docker privileges.
   * See: https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user
   */
  '@flecks/docker.containers': () => ({
    someContainer: {
      // Environment variables.
      environment: {
        SOME_CONTAINER_VAR: 'hello',
      },
      // The docker image.
      image: 'some-image:latest',
      // Some container path you'd like to persist. Flecks handles the host path.
      mount: '/some/container/path',
      // Expose ports.
      ports: {3000: 3000},
    },
  }),

  /**
   *
   * @param {string} dockerfile The content of the Dockerfile.
   *
   * @returns The new content of the Dockerfile.
   */
  '@flecks/docker.Dockerfile': (dockerfile) => (
    dockerfile.replace('DEBUG=*', 'DEBUG=*,-*:silly')
  ),

  /**
   *
   * @param {Object} config The object representing the docker compose configuration.
   */
  '@flecks/docker.docker-compose.yml': (config) => {
    config.version = '3.1';
  },

};
