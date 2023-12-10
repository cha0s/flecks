import {spawn} from 'child_process';
import {writeFile} from 'fs/promises';
import {join} from 'path';

import {D} from '@flecks/core';
import {dumpYml} from '@flecks/core/server';

import {generateComposeConfig, generateDockerFile} from './generate';

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
      const dockerFile = generateDockerFile(flecks);
      const composeConfig = await generateComposeConfig(flecks);
      const composeFile = dumpYml(composeConfig);
      const id = flecks.get('@flecks/core.id');
      const output = join(FLECKS_CORE_ROOT, 'dist');
      debug('writing %s...', composeFile);
      await writeFile(
        join(output, 'docker-compose.yml'),
        composeFile,
      );
      debug('writing %s...', dockerFile);
      await writeFile(
        join(output, 'Dockerfile'),
        dockerFile,
      );
      /* eslint-disable no-console */
      console.log();
      console.log('Outputs:');
      console.log();
      console.group('dist');
      console.group('Dockerfile');
      console.log(dockerFile);
      console.groupEnd();
      console.group('docker-compose.yml');
      console.log(composeFile);
      console.groupEnd();
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
