import {cp} from 'fs/promises';
import {join} from 'path';

import {createWorkspace} from '@flecks/core/build/testing';
import {
  binaryPath,
  pipesink,
  processCode,
  spawnWith,
} from '@flecks/core/server';

import {socketListener} from './listen';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

export const template = join(FLECKS_CORE_ROOT, 'test', 'server', 'template');

export async function createApplication() {
  const workspace = await createWorkspace();
  await cp(template, workspace, {recursive: true});
  return workspace;
}

class TestingServer {

  constructor(path, child, socketServer) {
    this.path = path;
    this.child = child;
    this.socketServer = socketServer;
  }

  async waitForSocket(options) {
    return this.socketServer.waitForSocket(options);
  }

}

export async function startServer({
  args = ['-h'],
  beforeBuild,
  failOnErrorCode = true,
  opts = {},
  path: request,
  task,
} = {}) {
  let previousTimeout;
  const start = Date.now();
  if (task) {
    previousTimeout = task.timeout();
    task.timeout(0);
  }
  const {socketPath, socketServer} = await socketListener();
  const path = request || await createApplication();
  if (beforeBuild) {
    await beforeBuild({path, task});
  }
  const server = spawnWith(
    [await binaryPath('flecks', '@flecks/build'), 'build', ...args],
    {
      stdio: 'pipe',
      ...opts,
      env: {
        FLECKS_ENV__flecks_server__stats: '{"preset": "none"}',
        FLECKS_ENV__flecks_server__start: true,
        FLECKS_CORE_ROOT: path,
        FLECKS_SERVER_TEST_SOCKET: socketPath,
        NODE_ENV: 'test',
        NODE_PATH: join(FLECKS_CORE_ROOT, '..', '..', 'node_modules'),
        ...opts.env,
      },
    },
  );
  server.on('exit', async () => {
    socketServer.close();
  });
  if (failOnErrorCode) {
    const stderr = pipesink(server.stderr);
    server.on('exit', async (code) => {
      if (!server.done && 0 !== code) {
        const buffer = await stderr;
        if (!process.stderr.write(buffer)) {
          await new Promise((resolve, reject) => {
            process.stderr.on('error', reject);
            process.stderr.on('drain', resolve);
          });
        }
        // eslint-disable-next-line no-console
        console.error('\nserver process exited unexpectedly\n');
        process.exit(code);
      }
    });
  }
  task?.timeout(previousTimeout + (Date.now() - start));
  return new TestingServer(
    path,
    server,
    socketServer,
  );
}

export function withServer(task, options) {
  return async function withServer() {
    const server = await startServer({...options, task: this});
    const socket = await server.waitForSocket({task: this});
    server.actions = async (actions) => {
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
    };
    await task({server, socket});
    server.child.done = true;
    server.child.kill();
  };
}

export async function build(path, {args = [], opts = {}} = {}) {
  return processCode(spawnWith(
    [await binaryPath('flecks', '@flecks/build'), 'build', ...args],
    {
      stdio: 'ignore',
      ...opts,
      env: {
        FLECKS_ENV__flecks_server__stats: '{"preset": "none"}',
        FLECKS_ENV__flecks_server__start: 0,
        FLECKS_CORE_ROOT: path,
        NODE_ENV: 'test',
        NODE_PATH: join(FLECKS_CORE_ROOT, '..', '..', 'node_modules'),
        ...opts.env,
      },
    },
  ));
}
