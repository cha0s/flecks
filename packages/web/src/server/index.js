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
  '@flecks/server.up': (flecks) => createHttpServer(flecks),
};

export const mixin = (Flecks) => class FlecksWithWeb extends Flecks {

  constructor(runtime) {
    super(runtime);
    if (!this.web) {
      this.web = {config: runtime['@flecks/web'], server: undefined};
    }
  }

};
