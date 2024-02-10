import {cp} from 'fs/promises';
import {join} from 'path';

import {createWorkspace} from '@flecks/core/build/testing';
import {binaryPath, processCode, spawnWith} from '@flecks/core/server';

import {listen} from './listen';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

export const template = join(FLECKS_CORE_ROOT, 'test', 'server', 'template');

export async function createApplication() {
  const workspace = await createWorkspace();
  await cp(template, workspace, {recursive: true});
  return workspace;
}

export async function buildChild(path, {args = [], opts = {}} = {}) {
  return spawnWith(
    [await binaryPath('flecks', '@flecks/build'), 'build', ...args],
    {
      stdio: 'ignore',
      ...opts,
      env: {
        FLECKS_ENV__flecks_server__stats: '{"preset": "none"}',
        FLECKS_ENV__flecks_server__start: 0,
        FLECKS_CORE_ROOT: path,
        NODE_PATH: join(FLECKS_CORE_ROOT, '..', '..', 'node_modules'),
        ...opts.env,
      },
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
        NODE_PATH: join(FLECKS_CORE_ROOT, '..', '..', 'node_modules'),
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
