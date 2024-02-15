import cluster from 'cluster';
import {createConnection} from 'net';

const {
  FLECKS_SERVER_TEST_SOCKET,
  NODE_ENV,
} = process.env;

export const hook = (flecks) => {
  if (!FLECKS_SERVER_TEST_SOCKET || 'test' !== NODE_ENV) {
    return;
  }
  const socket = createConnection(FLECKS_SERVER_TEST_SOCKET);
  if (cluster.isWorker) {
    cluster.worker.on('disconnect', () => {
      socket.end();
    });
  }
  flecks.server.socket = socket;
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
};