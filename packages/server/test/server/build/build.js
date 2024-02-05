import {cp, mkdir} from 'fs/promises';
import {join} from 'path';

import {rimraf} from '@flecks/build/server';
import {processCode, spawnWith} from '@flecks/core/server';

import {listen} from './listen';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

export const applications = join(FLECKS_CORE_ROOT, 'node_modules', '.cache', '@flecks', 'server');
export const template = join(FLECKS_CORE_ROOT, 'test', 'server', 'template');

export async function createApplicationAt(path) {
  await rimraf(join(applications, path));
  await mkdir(join(applications, path), {recursive: true});
  const qualified = join(applications, path, process.pid.toString());
  await cp(template, qualified, {recursive: true});
  return qualified;
}

export function build(path, {args = [], opts = {}} = {}) {
  return processCode(spawnWith(
    ['npx', 'flecks', 'build', ...args],
    {
      ...opts,
      env: {
        FLECKS_ENV__flecks_server__stats: '{"all": false}',
        FLECKS_ENV__flecks_server__start: 0,
        FLECKS_CORE_ROOT: path,
        ...opts.env,
      },
    },
  ));
}

export async function serverActions(path, actions) {
  const {connected, listening, path: socketPath} = await listen();
  await listening;
  const server = spawnWith(
    ['node', join(path, 'dist', 'server')],
    {
      env: {
        FLECKS_SERVER_TEST_SOCKET: socketPath,
      },
    },
  );
  const [code, results] = await Promise.all([
    processCode(server),
    connected.then(async (socket) => {
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
