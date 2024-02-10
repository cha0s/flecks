import {randomBytes} from 'crypto';
import {mkdir} from 'fs/promises';
import {tmpdir} from 'os';
import {join} from 'path';

import {rimraf} from 'rimraf';

export function id() {
  return new Promise((resolve, reject) => {
    randomBytes(16, (error, bytes) => (error ? reject(error) : resolve(bytes.toString('hex'))));
  });
}

export async function createWorkspace() {
  const workspace = join(tmpdir(), '@flecks', 'core', 'testing', await id());
  await mkdir(workspace, {recursive: true});
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
