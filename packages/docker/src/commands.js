import {spawn} from 'child_process';
import {writeFile} from 'fs/promises';
import {join, relative} from 'path';

import {D} from '@flecks/core';
import {dumpYml} from '@flecks/core/server';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const debug = D('@flecks/docker/commands');

export default (program, flecks) => {
  const commands = {};
  commands.docker = {
    options: [
      ['-b, --build', 'build the image from Dockerfile'],
      ['-c, --compose', 'run docker-compose'],
      ['-t, --tag <name>', '(implies -b) tag the built image'],
    ],
    description: 'generate Dockerfile and docker-compose.yml, optionally with further interaction',
    action: async (opts) => {
      const {
        build,
        compose,
        tag,
      } = opts;
      const output = join(FLECKS_CORE_ROOT, 'dist');
      const lines = [
        "version: '3'",
        'services:',
        '',
      ];
      const id = flecks.get('@flecks/core.id');
      const appServiceName = `${id}_app`;
      const services = {
        [appServiceName]: {
          build: {
            context: '..',
            dockerfile: 'dist/Dockerfile',
          },
          environment: {
            FLECKS_ENV_FLECKS_DOCKER_SERVER_enabled: 'false',
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
                `FLECKS_ENV_${flecks.constructor.environmentalize(fleck)}`,
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
                        ? [`${prefix}_${key}`, appServiceName]
                        : [key, configService];
                      services[realService].environment[realKey] = value;
                    });
                });
            });
        });
      Object.entries(services)
        .forEach(([key, service]) => {
          lines.push(
            ...dumpYml({[key]: service})
              .split('\n')
              .map((line) => `  ${line}`),
          );
        });
      const composeFile = join(output, 'docker-compose.yml');
      debug('writing %s...', composeFile);
      await writeFile(
        composeFile,
        lines
          .map((line) => ('' === line.trim() ? '' : line))
          .join('\n'),
      );
      const dockerFile = join(output, 'Dockerfile');
      debug('writing %s...', dockerFile);
      await writeFile(
        dockerFile,
        [
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
          'CMD ["node", "./dist/index.js"]',
          '',
          'VOLUME /var/www/node_modules',
          '',
        ].join('\n'),
      );
      /* eslint-disable no-console */
      console.log();
      console.log('Outputs:');
      console.log();
      console.group();
      console.log(relative(FLECKS_CORE_ROOT, composeFile));
      console.log(relative(FLECKS_CORE_ROOT, dockerFile));
      console.groupEnd();
      console.log();
      /* eslint-enable no-console */
      if (build || tag) {
        spawn(
          'docker',
          ['build', '-f', join(output, 'Dockerfile')].concat(tag ? ['-t', tag] : []).concat('.'),
          {stdio: 'inherit'},
        );
      }
      if (compose) {
        spawn(
          'docker-compose',
          ['-p', id, '-f', join(output, 'docker-compose.yml'), 'up', '--build'],
          {stdio: 'inherit'},
        );
      }
    },
  };
  return commands;
};
