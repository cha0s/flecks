exports.generateDockerFile = (flecks) => {
  const dockerfile = [
    'FROM node:20',
    '',
    'RUN mkdir -p /var/www',
    'WORKDIR /var/www',
    'COPY package.json /var/www',
    'COPY build /var/www/build',
    'COPY dist /var/www/dist',
    '',
    'ENV DEBUG=*',
    'ENV NODE_ENV=production',
    '',
    'CMD ["node", "./dist/server/index.js"]',
    '',
    'VOLUME /var/www/node_modules',
    '',
  ].join('\n');
  return flecks.invokeComposed('@flecks/docker.Dockerfile', dockerfile);
};

exports.generateComposeConfig = async (flecks) => {
  const id = flecks.get('@flecks/core.id');
  const appServiceName = `${id}_app`;
  const services = {
    [appServiceName]: {
      build: {
        context: '..',
        dockerfile: 'dist/server/Dockerfile',
      },
      environment: {
        FLECKS_ENV__flecks_docker_server__enabled: 'false',
      },
      volumes: [
        '../node_modules:/var/www/node_modules',
      ],
    },
  };
  const containers = flecks.invoke('@flecks/docker.containers');
  (
    await Promise.all(
      Object.entries(containers)
        .map(async ([fleck, config]) => {
          Object.entries(await config)
            .forEach(([key, config]) => {
              services[key] = {image: config.image, environment: {}, ...config.extra};
            });
          return [
            `FLECKS_ENV__${flecks.constructor.environmentalize(fleck)}`,
            config,
          ];
        }),
    )
  )
    // Set environment.
    .forEach(([prefix, config]) => {
      Object.values(config)
        .forEach((config) => {
          Object.entries(config.environment || {})
            .forEach(([configService, environment]) => {
              Object.entries(environment || {})
                .forEach(([key, value]) => {
                  const [realKey, realService] = 'app' === configService
                    ? [`${prefix}__${key}`, appServiceName]
                    : [key, configService];
                  services[realService].environment[realKey] = value;
                });
            });
        });
    });
  const config = {version: '3', services};
  flecks.invoke('@flecks/docker.docker-compose.yml', config);
  return config;
};
