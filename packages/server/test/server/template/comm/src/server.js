import {createConnection} from 'net';

const {
  FLECKS_SERVER_TEST_SOCKET,
} = process.env;

export const hooks = {
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
    const socket = createConnection({path: FLECKS_SERVER_TEST_SOCKET});
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
