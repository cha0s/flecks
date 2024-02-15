import {configSource, inlineConfig} from './config';
import {createHttpServer} from './http';

const {
  NODE_ENV,
} = process.env;

export {configSource};

export const hooks = {
  '@flecks/web.routes': (flecks) => {
    const routes = [
      {
        method: 'get',
        path: '/flecks.config.js',
        middleware: async (req, res) => {
          res.setHeader('Content-Type', 'application/javascript; charset=UTF-8');
          res.send(await configSource(flecks, req));
        },
      },
    ];
    if ('test' === NODE_ENV) {
      routes.push({
        method: 'post',
        path: '/@flecks/web/testing',
        middleware: (req, res, next) => {
          flecks.server.socket.write(JSON.stringify({payload: req.body, type: req.query.type}));
          next();
        },
      });
    }
    return routes;
  },
  '@flecks/web/server.stream.html': inlineConfig,
  '@flecks/server.test.socket': async (action, socket, flecks) => {
    while (!flecks.web.server) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => {
        setTimeout(resolve, 50);
      });
    }
    const {meta, type} = action;
    switch (type) {
      case 'web.public':
        socket.write(JSON.stringify({
          meta,
          payload: flecks.web.public,
        }));
        break;
      default:
    }
  },
  '@flecks/server.up': async (flecks) => {
    await createHttpServer(flecks);
  },
};

export const mixin = (Flecks) => class FlecksWithWeb extends Flecks {

  constructor(runtime) {
    super(runtime);
    if (!this.web) {
      const {
        host = 'production' === NODE_ENV ? '0.0.0.0' : 'localhost',
        port,
        public: httpPublic,
      } = runtime.config['@flecks/web'];
      this.web = {
        config: runtime['@flecks/web'],
        host,
        public: httpPublic || [host, port].join(':'),
        server: undefined,
      };
    }
  }

};
