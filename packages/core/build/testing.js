import {randomBytes} from 'crypto';
import {mkdir} from 'fs/promises';
import {tmpdir} from 'os';
import {basename, join} from 'path';

import {rimraf} from 'rimraf';

export function id() {
  return new Promise((resolve, reject) => {
    randomBytes(16, (error, bytes) => (error ? reject(error) : resolve(bytes.toString('hex'))));
  });
}

export async function createWorkspace() {
  let workspace = join(tmpdir(), '@flecks', 'core', 'testing', await id());
  try {
    throw new Error();
  }
  catch (error) {
    workspace += `-${basename(
      error.stack
        .split('\n').slice(-1)[0]
        .split('at ')[1]
        .match(/\((.*)\)$/)[1]
        .split(':').slice(-3, -2)[0],
    )}`;
  }
  await mkdir(workspace, {recursive: true});
  process.on('exit', () => {
    rimraf.sync(workspace);
  });
  // sheeeeesh
  process.prependListener('message', async (message) => {
    if ('__workerpool-terminate__' === message) {
      rimraf.sync(workspace);
    }
  });
  return workspace;
}

export function heavySetup(fn) {
  return function heavySetup() {
    this.timeout(0);
    return fn();
  };
}
