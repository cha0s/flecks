import cluster from 'cluster';
import {createConnection} from 'net';

const {
  FLECKS_SERVER_TEST_SOCKET,
} = process.env;

export const hooks = {
  '@flecks/core.reload': (fleck, config) => {
    if ('comm' === fleck && 'fail' === config.foo) {
      throw new Error();
    }
  },
  '@flecks/core.hmr': async (path, M, flecks) => {
    if (!flecks.socket) {
      return;
    }
    flecks.socket.write(JSON.stringify({
      type: 'hmr',
      payload: path,
    }));
  },
  '@flecks/server.up': async (flecks) => {
    if (!FLECKS_SERVER_TEST_SOCKET) {
      return;
    }
    const socket = createConnection(FLECKS_SERVER_TEST_SOCKET);
    if (cluster.isWorker) {
      cluster.worker.on('disconnect', () => {
        socket.end();
      });
    }
    flecks.socket = socket;
    socket.on('connect', () => {
      socket.on('data', (data) => {
        const {meta, payload, type} = JSON.parse(data);
        switch (type) {
          case 'config.get':
            socket.write(JSON.stringify({
              meta,
              payload: flecks.get(payload),
            }));
            break;
          case 'exit':
            socket.end();
            process.exit(payload);
            break;
          default:
        }
      });
    });
  },
};
