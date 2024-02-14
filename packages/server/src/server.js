import cluster from 'cluster';
import {createConnection} from 'net';

const {
  FLECKS_SERVER_TEST_SOCKET,
  NODE_ENV,
} = process.env;

export const hooks = {
  '@flecks/core.hmr.hook': (hook) => {
    if ('@flecks/server.up' === hook) {
      if (cluster.isWorker) {
        cluster.worker.disconnect();
        const error = new Error('@flecks/server.up implementation changed!');
        error.stack = '';
        throw error;
      }
    }
  },
  '@flecks/server.up': (flecks) => {
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
  },
};

export const mixin = (Flecks) => class FlecksWithServer extends Flecks {

  constructor(runtime) {
    super(runtime);
    this.server = {};
  }

};
