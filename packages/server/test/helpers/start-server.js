import {mkdir} from 'fs/promises';
import {createServer} from 'net';
import {tmpdir} from 'os';
import {dirname, join} from 'path';
import {PassThrough} from 'stream';

import {id} from '@flecks/core/build/testing';
import {
  binaryPath,
  pipesink,
  spawnWith,
} from '@flecks/core/server';

import {createApplication} from './create-application';

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

class SocketWrapper {

  constructor(socket) {
    this.socket = socket;
  }

  async send(action) {
    const unique = await id();
    return new Promise((resolve, reject) => {
      const onData = (data) => {
        const action = JSON.parse(data.toString());
        if (unique === action.meta.id) {
          this.socket.off('error', reject);
          this.socket.off('data', onData);
          resolve(action);
        }
      };
      this.socket.on('close', () => {
        this.socket.off('error', reject);
        this.socket.off('data', onData);
        resolve();
      });
      this.socket.on('error', reject);
      this.socket.on('data', onData);
      this.socket.write(JSON.stringify({...action, meta: {...action.meta, id: unique}}));
    });
  }

  async waitForAction(type) {
    return new Promise((resolve, reject) => {
      this.socket.on('error', reject);
      this.socket.on('data', (data) => {
        const action = JSON.parse(data.toString());
        if (action.type === type) {
          resolve(action);
        }
      });
    });
  }

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

async function socketListener() {
  const path = join(tmpdir(), 'flecks', 'ci', await id());
  await mkdir(dirname(path), {recursive: true});
  const server = createServer();
  server.listen(path);
  server.waitForSocket = ({task, timeout = 30000} = {}) => (
    new Promise((resolve, reject) => {
      let previousTimeout;
      const start = Date.now();
      if (task) {
        previousTimeout = task.timeout();
        task.timeout(0);
      }
      const handle = setTimeout(() => {
        reject(new Error('timeout waiting for IPC connection'));
      }, timeout);
      const finish = () => {
        clearTimeout(handle);
        task?.timeout(previousTimeout + (Date.now() - start));
      };
      server.on('error', (error) => {
        finish();
        reject(error);
      });
      server.on('connection', (socket) => {
        finish();
        resolve(new SocketWrapper(socket));
      });
    })
  );
  await new Promise((resolve, reject) => {
    server.on('error', reject);
    server.on('listening', resolve);
  });
  return {socketServer: server, socketPath: path};
}

export async function startServer({
  args = ['-h'],
  beforeBuild,
  failOnErrorCode = true,
  opts = {},
  path: request,
  task,
  template,
} = {}) {
  let previousTimeout;
  const start = Date.now();
  if (task) {
    previousTimeout = task.timeout();
    task.timeout(0);
  }
  const {socketPath, socketServer} = await socketListener();
  const path = request || await createApplication(template);
  if (beforeBuild) {
    await beforeBuild({path, task});
  }
  const spawnOptions = {
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
  };
  const server = spawnWith(
    [await binaryPath('flecks', '@flecks/build'), 'build', ...args],
    spawnOptions,
  );
  server.on('exit', async () => {
    socketServer.close();
  });
  if (failOnErrorCode && 'pipe' === spawnOptions.stdio) {
    const stdio = pipesink(server.stderr.pipe(server.stdout.pipe(new PassThrough())));
    server.on('exit', async (code) => {
      if (!server.done && 0 !== code) {
        const buffer = await stdio;
        if (!process.stderr.write(buffer)) {
          await new Promise((resolve, reject) => {
            process.stderr.on('error', reject);
            process.stderr.on('drain', resolve);
          });
        }
        throw new Error('\nserver process exited unexpectedly\n');
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
