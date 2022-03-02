import {exec, spawn} from 'child_process';
import {mkdir} from 'fs/promises';
import {tmpdir} from 'os';
import {join} from 'path';

import {D} from '@flecks/core';

const debug = D('@flecks/docker/container');

const containerIsRunning = async (name) => (
  new Promise((r, e) => {
    exec(
      `docker container inspect -f '{{.State.Running}}' ${name}`,
      {stdio: 'pipe'},
      (error, stdout) => {
        if (error && 1 !== error.code) {
          e(error);
          return;
        }
        r('true\n' === stdout);
      },
    );
  })
);

export default async (flecks, key, config) => {
  const {id} = flecks.get('@flecks/core');
  if (!config.image) {
    throw new Error(`@flecks/docker: ${key} container has no image specified`);
  }
  if (!config.mount) {
    throw new Error(`@flecks/docker: ${key} container has no mount point specified`);
  }
  const name = `${id}_${key}`;
  if (await containerIsRunning(name)) {
    debug("'%s' already running", key);
    return;
  }
  const args = [
    'run',
    '--name', name,
    '-d',
    '--rm',
    ...(config.args || []),
    ...Object.entries(config.ports || {})
      .map(([host, container]) => ['-p', `${host}:${container}`]).flat(),
    ...Object.entries(config.environment[key] || {})
      .map(([key, value]) => ['-e', `${key}=${value}`]).flat(),
  ];
  const datadir = join(tmpdir(), 'flecks', id, 'docker', key);
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
  const child = spawn('docker', args, {
    detached: true,
    stdio: 'ignore',
  });
  await new Promise((r, e) => {
    child.on('error', e);
    child.on('exit', (code) => {
      if (0 !== code) {
        e(new Error(`spawning ${name} failed with error code ${code}`));
        return;
      }
      r();
    });
  });
  child.unref();
  // eslint-disable-next-line no-await-in-loop
  while (await !containerIsRunning(name)) {
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
