import {createConnection} from 'net';

const {
  FLECKS_SERVER_TEST_SOCKET,
} = process.env;

export const hooks = {
  '@flecks/server.up': async (flecks) => {
    const socket = createConnection({path: FLECKS_SERVER_TEST_SOCKET});
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
