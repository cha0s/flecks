import {execSync, spawn} from 'child_process';
import {mkdir} from 'fs/promises';
import {tmpdir} from 'os';
import {join} from 'path';

import D from 'debug';

const debug = D('@flecks/docker/container');

const containerIsRunning = (name) => {
  try {
    const output = execSync(
      `docker container inspect -f '{{.State.Running}}' ${name}`,
      {stdio: 'pipe'},
    ).toString();
    if ('true\n' === output) {
      return true;
    }
  }
  catch (e) {
    if (1 !== e.status) {
      throw e;
    }
  }
  return false;
};

export default async (flecks, key, config) => {
  const {id} = flecks.get('@flecks/core');
  if (!config.image) {
    throw new Error(`@flecks/docker: ${key} container has no image specified`);
  }
  if (!config.mount) {
    throw new Error(`@flecks/docker: ${key} container has no mount point specified`);
  }
  const name = `${id}_${key}`;
  if (containerIsRunning(name)) {
    debug("'%s' already running", key);
    return;
  }
  const args = [
    'run',
    '--name', name,
    '--rm',
    ...(config.args || []),
    ...Object.entries(config.ports)
      .map(([host, container]) => ['-p', `${host}:${container}`]).flat(),
  ];
  const datadir = join(tmpdir(), 'flecks', key, 'docker');
  debug("creating datadir '%s'", datadir);
  try {
    await mkdir(datadir, {recursive: true});
  }
  catch (error) {
    if ('EEXIST' !== error.code) {
      throw error;
    }
  }
  args.push('-v', `${datadir}:${config.mount}`);
  args.push(config.image);
  debug('launching: docker %s', args.join(' '));
  spawn('docker', args, {
    detached: true,
    stdio: 'ignore',
  }).unref();
  while (!containerIsRunning(name)) {
    debug("waiting for '%s' to start...", key);
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
  debug("'%s' started", key);
  if (config.hasConnected) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      if (await config.hasConnected()) {
        break;
      }
      debug("waiting for '%s' to connect...", key);
    }
    debug("'%s' connected", key);
  }
};
