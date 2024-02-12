import {mkdir} from 'fs/promises';
import {createServer} from 'net';
import {tmpdir} from 'os';
import {dirname, join} from 'path';

import {id} from '@flecks/core/build/testing';

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

export async function socketListener() {
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
