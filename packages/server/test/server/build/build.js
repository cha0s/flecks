import {cp, mkdir} from 'fs/promises';
import {join} from 'path';

import {rimraf} from '@flecks/build/server';
import {binaryPath, processCode, spawnWith} from '@flecks/core/server';

import id from './id';
import {listen} from './listen';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

export const applications = join(FLECKS_CORE_ROOT, 'node_modules', '.cache', '@flecks', 'server');
export const template = join(FLECKS_CORE_ROOT, 'test', 'server', 'template');

export async function createApplication() {
  const path = join(applications, await id());
  await rimraf(path);
  await mkdir(path, {recursive: true});
  await cp(template, path, {recursive: true});
  // sheeeeesh
  process.prependListener('message', async (message) => {
    if ('__workerpool-terminate__' === message) {
      rimraf.sync(path);
    }
  });
  return path;
}

export async function buildChild(path, {args = [], opts = {}} = {}) {
  return spawnWith(
    [await binaryPath('flecks', '@flecks/build'), 'build', ...args],
    {
      ...opts,
      env: {
        FLECKS_ENV__flecks_server__stats: '{"preset": "none"}',
        FLECKS_ENV__flecks_server__start: 0,
        FLECKS_CORE_ROOT: path,
        ...opts.env,
      },
      stdio: 'ignore',
    },
  );
}

export async function build(path, {args = [], opts = {}} = {}) {
  return processCode(await buildChild(path, {args, opts}));
}

export async function serverActions(path, actions) {
  const {listening, path: socketPath, socketServer} = await listen();
  await listening;
  const server = spawnWith(
    ['node', join(path, 'dist', 'server')],
    {
      env: {
        FLECKS_SERVER_TEST_SOCKET: socketPath,
      },
      stdio: 'ignore',
    },
  );
  const [code, results] = await Promise.all([
    processCode(server),
    socketServer.waitForSocket().then(async (socket) => {
      const results = [];
      await actions.reduce(
        (p, action) => (
          p.then(() => (
            socket.send(action)
              .then((result) => {
                results.push(result);
              })
          ))
        ),
        Promise.resolve(),
      );
      return results;
    }),
  ]);
  return {code, results};
}
