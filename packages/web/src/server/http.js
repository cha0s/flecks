import {createReadStream} from 'fs';
import {createServer, ServerResponse} from 'http';
import {join} from 'path';
import {PassThrough, Transform} from 'stream';

import {D} from '@flecks/core';
import {binaryPath, prefixLines, spawnWith} from '@flecks/core/server';
import chalk from 'chalk';
import compression from 'compression';
import express from 'express';
import httpProxy from 'http-proxy';

import {Abort} from './abort';

const {
  FLECKS_CORE_ROOT = process.cwd(),
  FLECKS_WEB_DEV_SERVER,
  NODE_ENV,
} = process.env;

const debug = D('@flecks/web/server/http');

const deliverHtmlStream = async (stream, req, res, flecks) => {
  req.abort = () => {
    throw new Abort();
  };
  let walk = stream;
  const implementations = flecks.flecksImplementing('@flecks/web/server.stream.html');
  for (let i = 0; i < implementations.length; ++i) {
    const fleck = implementations[i];
    const implementation = flecks.fleckImplementation(fleck, '@flecks/web/server.stream.html');
    try {
      // eslint-disable-next-line no-await-in-loop
      walk = await implementation(walk, req, res, flecks);
    }
    catch (error) {
      if (error instanceof Abort) {
        res.status(res.statusCode || 500).end();
        return;
      }
      throw error;
    }
  }
  res.status(res.statusCode || stream.statusCode || 200);
  walk.pipe(res);
};

export const createHttpServer = async (flecks) => {
  const {
    devProxyWds = 'production' !== NODE_ENV,
    public: publicConfig,
    port,
    trust,
  } = flecks.get('@flecks/web');
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', trust);
  const httpServer = createServer(app);
  httpServer.app = app;
  // Hold requests until the server is up.
  let markAsUp;
  let waitingOnUp = new Promise((resolve) => {
    markAsUp = () => {
      waitingOnUp = undefined;
      resolve();
    };
  });
  app.use(async (req, res, next) => {
    if (!waitingOnUp) {
      next();
      return;
    }
    await waitingOnUp;
    next();
  });
  // Body parser.
  app.use(express.urlencoded({extended: true}));
  app.use(express.json());
  // Compression.                                         heheh
  app.use(compression({level: 'production' === NODE_ENV ? 6 : 9}));
  // Socket connection.
  app.use(flecks.makeMiddleware('@flecks/web/server.request.socket'));
  // Routes.
  const routeMiddleware = flecks.makeMiddleware('@flecks/web/server.request.route');
  const routes = (await Promise.all(flecks.invokeFlat('@flecks/web.routes'))).flat();
  debug('routes: %O', routes);
  routes.forEach(({method, path, middleware}) => app[method](path, routeMiddleware, middleware));
  const {host} = flecks.web;
  await new Promise((resolve, reject) => {
    const args = [port];
    if (host) {
      args.push(host);
    }
    const onError = (error) => {
      if ('EADDRINUSE' === error.code) {
        error.message = (
          `HTTP server couldn't connect: '${[host, port].join(':')}' already in use!`
        );
      }
      reject(error);
    };
    httpServer.on('error', onError);
    args.push(async () => {
      httpServer.off('error', onError);
      await flecks.invokeSequentialAsync('@flecks/web/server.up', httpServer);
      const actualPort = 0 === port ? httpServer.address().port : port;
      debug(
        'HTTP server up @ %s!',
        chalk.cyan(new URL(`http://${[host, actualPort].filter((e) => !!e).join(':')}`)),
      );
      if ('undefined' === typeof publicConfig) {
        flecks.web.public = [host, actualPort].join(':');
      }
      resolve();
    });
    debug('httpServer.listen(%s)', args.slice(0, -1).join(', '));
    httpServer.listen(...args);
  });
  // Create a proxy to the webpack-dev-server.
  if (devProxyWds) {
    const {
      devHost,
      devPort,
    } = flecks.get('@flecks/web');
    const wdsHost = devHost || host;
    let wdsPort;
    if (0 === devPort) {
      wdsPort = 0;
    }
    else if (devPort) {
      wdsPort = devPort;
    }
    else {
      wdsPort = httpServer.address().port + 1;
    }
    if (FLECKS_WEB_DEV_SERVER) {
      // Otherwise, spawn `webpack-dev-server` (WDS).
      const cmd = [
        await binaryPath('webpack', '@flecks/build'),
        'serve',
        '--mode', 'development',
        '--hot',
        '--host', wdsHost,
        '--port', wdsPort,
        '--config', FLECKS_WEB_DEV_SERVER,
      ];
      const wds = spawnWith(
        cmd,
        {
          env: {
            FLECKS_CORE_BUILD_LIST: 'web',
          },
          stdio: 0 === wdsPort ? 'pipe' : 'inherit',
        },
      );
      if (0 === wdsPort) {
        class ParsePort extends Transform {

          constructor() {
            super();
            let resolve;
            let reject;
            this.port = new Promise((res, rej) => {
              resolve = res;
              reject = rej;
            });
            this.resolve = resolve;
            this.on('error', reject);
          }

          // eslint-disable-next-line no-underscore-dangle, class-methods-use-this
          _transform(chunk, encoding, done) {
            this.push(chunk);
            const matches = chunk.toString().match(/http:\/\/.*\//g);
            if (!matches) {
              done();
              return;
            }
            const [port] = matches
              .slice(0, 1)
              .map((match) => new URL(match))
              .map(({port}) => port);
            done();
            this.resolve(port);
          }

        }
        const parsePort = new ParsePort();
        const stderr = new PassThrough();
        prefixLines(wds.stderr.pipe(parsePort), chalk.yellow('[WDS] '))
          .pipe(stderr);
        stderr.pipe(process.stderr);
        prefixLines(wds.stdout, chalk.yellow('[WDS] '))
          .pipe(process.stdout);
        wdsPort = await parsePort.port;
        parsePort.unpipe(stderr);
        stderr.unpipe(process.stderr);
        prefixLines(wds.stderr, chalk.yellow('[WDS] '))
          .pipe(process.stderr);
      }
    }
    const proxy = httpProxy.createProxyServer({
      secure: false,
      target: `http://${wdsHost}:${wdsPort}`,
    });
    proxy.on('proxyRes', async (proxyRes, req, res) => {
      res.statusCode = proxyRes.statusCode;
      // HTML.
      if (proxyRes.headers['content-type']?.match('text/html')) {
        routeMiddleware(req, res, async (error) => {
          if (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            res.status(error.code || 500).end(error.stack);
            return;
          }
          if (!res.headersSent) {
            res.setHeader('Content-Type', proxyRes.headers['content-type']);
          }
          try {
            res.statusCode = null;
            await deliverHtmlStream(proxyRes, req, res, flecks);
          }
          catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            res.status(error.code || 500).end(error.stack);
          }
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
    // Fallback to serving HTML.
    app.get('*', routeMiddleware, async (req, res) => {
      if (req.accepts('text/html')) {
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        const stream = createReadStream(join(FLECKS_CORE_ROOT, 'dist', 'web', 'index.html'));
        try {
          res.statusCode = null;
          await deliverHtmlStream(stream, req, res, flecks);
        }
        catch (error) {
          res.status(500).end('Internal error');
        }
      }
      else {
        res.status(400).end('Bad Request');
      }
    });
  }
  flecks.web.server = httpServer;
  markAsUp();
};

export const destroyHttpServer = (httpServer) => {
  if (!httpServer) {
    return;
  }
  httpServer.close();
  debug('HTTP server down!');
};
