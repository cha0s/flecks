import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server';

import {createFetchRequest} from './request';

export const hooks = {
  '@flecks/core.hmr.hook': (hook, fleck, flecks) => {
    if ('@flecks/react/router.routes' === hook) {
      flecks.reactRouter.invalidate();
    }
  },
  '@flecks/core.reload': (fleck, config, flecks) => {
    if ('@flecks/react/router' === fleck) {
      flecks.reactRouter.invalidate();
    }
  },
  '@flecks/web/server.request.socket': (flecks) => async (req, res, next) => {
    const handler = await flecks.reactRouter.ensureLatestHandler();
    const context = await handler.query(createFetchRequest(req, res));
    if (context instanceof Response && [301, 302, 303, 307, 308].includes(context.status)) {
      res.redirect(context.status, context.headers.get('Location'));
      return;
    }
    next();
  },
  '@flecks/react.roots': async (req, res, flecks) => {
    const handler = await flecks.reactRouter.ensureLatestHandler();
    const context = await handler.query(createFetchRequest(req, res));
    if ([404].includes(context.statusCode)) {
      res.status(context.statusCode);
      req.abort();
      return undefined;
    }
    const router = createStaticRouter(handler.dataRoutes, context);
    return [StaticRouterProvider, {context, router}];
  },
};

export const mixin = (Flecks) => class FlecksWithReactRouterServer extends Flecks {

  constructor(runtime) {
    super(runtime);
    const flecks = this;
    let routes;
    let handler;
    this.reactRouter = {
      async ensureLatestHandler() {
        if (!routes) {
          const {root} = flecks.get('@flecks/react/router');
          routes = await flecks.invokeFleck('@flecks/react/router.routes', root);
          handler = createStaticHandler(routes);
        }
        return handler;
      },
      invalidate() {
        routes = undefined;
      },
    };
  }

};
