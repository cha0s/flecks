import {createReadStream} from 'fs';
import {createServer, ServerResponse} from 'http';
import {join} from 'path';

import {D} from '@flecks/core';
import compression from 'compression';
import express from 'express';
import httpProxy from 'http-proxy';

const {
  FLECKS_CORE_ROOT = process.cwd(),
  NODE_ENV,
} = process.env;

const debug = D('@flecks/web/server/http');

const deliverHtmlStream = async (stream, flecks, req, res) => {
  (await flecks.invokeComposedAsync('@flecks/web/server.stream.html', stream, req)).pipe(res);
};

export const createHttpServer = async (flecks) => {
  const {trust} = flecks.get('@flecks/web');
  const {
    devHost,
    devPort,
    host,
    port,
  } = flecks.get('@flecks/web');
  const app = express();
  app.set('trust proxy', trust);
  const httpServer = createServer(app);
  httpServer.app = app;
  flecks.web.server = httpServer;
  // Compression.                                         heheh
  app.use(compression({level: 'production' === NODE_ENV ? 6 : 9}));
  // Socket connection.
  app.use(flecks.makeMiddleware('@flecks/web/server.request.socket'));
  // Routes.
  const routeMiddleware = flecks.makeMiddleware('@flecks/web/server.request.route');
  const routes = (await Promise.all(flecks.invokeFlat('@flecks/web.routes'))).flat();
  debug('routes: %O', routes);
  routes.forEach(({method, path, middleware}) => app[method](path, routeMiddleware, middleware));
  // In development mode, create a proxy to the webpack-dev-server.
  if ('production' !== NODE_ENV) {
    const proxy = httpProxy.createProxyServer({
      secure: false,
      target: `http://${devHost}:${devPort || (port + 1)}`,
    });
    proxy.on('proxyRes', async (proxyRes, req, res) => {
      res.statusCode = proxyRes.statusCode;
      // HTML.
      if (proxyRes.headers['content-type']?.match('text/html')) {
        // Tests bypass middleware and stream processing.
        const {pathname} = new URL(req.url, 'https://example.org/');
        if ('/tests.html' === pathname) {
          if (!res.headersSent) {
            res.setHeader('Content-Type', proxyRes.headers['content-type']);
          }
          proxyRes.pipe(res);
          return;
        }
        routeMiddleware(req, res, (error) => {
          if (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            res.status(error.code || 500).end(error.stack);
            return;
          }
          if (!res.headersSent) {
            res.setHeader('Content-Type', proxyRes.headers['content-type']);
          }
          deliverHtmlStream(proxyRes, flecks, req, res);
        });
      }
      // Any other assets.
      else {
        if (proxyRes.headers['content-type']) {
          res.setHeader('Content-Type', proxyRes.headers['content-type']);
        }
        proxyRes.pipe(res);
      }
    });
    proxy.on('error', (error, req, res) => {
      if (res instanceof ServerResponse) {
        debug('webpack-dev-server proxy failed, got: %s', error.message);
        if ('ECONNREFUSED' === error.code) {
          debug('retrying in 1 second...');
          setTimeout(() => {
            proxy.web(req, res, {selfHandleResponse: true});
          }, 1000);
          return;
        }
        res.status(502).end('Bad Gateway (WDS)');
      }
    });
    app.all('*', (req, res) => {
      proxy.web(req, res, {selfHandleResponse: true});
    });
    httpServer.on('upgrade', (req, socket, head) => {
      proxy.ws(req, socket, head);
    });
    httpServer.on('close', () => {
      proxy.close();
    });
  }
  else {
    // Serve the document root, sans index.
    app.use(express.static(join(FLECKS_CORE_ROOT, 'dist', 'web'), {index: false}));
    // Tests bypass middleware and stream processing.
    app.get('/tests.html', (req, res) => {
      res.setHeader('Content-Type', 'text/html; charset=UTF-8');
      const stream = createReadStream(join(FLECKS_CORE_ROOT, 'dist', 'web', 'tests.html'));
      stream.pipe(res);
    });
    // Fallback to serving HTML.
    app.get('*', routeMiddleware, async (req, res) => {
      if (req.accepts('text/html')) {
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        const stream = createReadStream(join(FLECKS_CORE_ROOT, 'dist', 'web', 'index.html'));
        deliverHtmlStream(stream, flecks, req, res);
      }
      else {
        res.status(400).end('Bad Request');
      }
    });
  }
  return new Promise((resolve, reject) => {
    const args = [port];
    if (host) {
      args.push(host);
    }
    args.push(async (error) => {
      if (error) {
        reject(error);
        return;
      }
      await flecks.invokeSequentialAsync('@flecks/web/server.up', httpServer);
      debug('HTTP server up @ %s!', [host, port].filter((e) => !!e).join(':'));
      resolve();
    });
    debug('httpServer.listen(...%O)', args.slice(0, -1));
    httpServer.listen(...args);
  });
};

export const destroyHttpServer = (httpServer) => {
  if (!httpServer) {
    return;
  }
  httpServer.close();
  debug('HTTP server down!');
};
