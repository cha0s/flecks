import {mkdir} from 'fs/promises';
import {createServer} from 'net';
import {tmpdir} from 'os';
import {dirname, join} from 'path';

import id from './id';

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

  async waitForHmr() {
    return new Promise((resolve, reject) => {
      this.socket.on('error', reject);
      this.socket.on('data', (data) => {
        const action = JSON.parse(data.toString());
        if ('hmr' === action.type) {
          resolve(action);
        }
      });
    });
  }

}

export async function listen() {
  const path = join(tmpdir(), 'flecks', 'ci', await id());
  await mkdir(dirname(path), {recursive: true});
  const server = createServer();
  server.listen(path);
  server.waitForSocket = () => (
    new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('connection', (socket) => {
        resolve(new SocketWrapper(socket));
      });
    })
  );
  return {
    listening: new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('listening', resolve);
    }),
    path,
    socketServer: server,
  };
}

export async function socketListener() {
  const {listening, path: socketPath, socketServer} = await listen();
  await listening;
  return {socketServer, socketPath};
}