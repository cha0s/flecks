import {Flecks} from '@flecks/core';
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider,
} from 'react-router-dom/server';

import {createFetchRequest} from './request';

export const hooks = {
  '@flecks/web/server.request.socket': (flecks) => async (req, res, next) => {
    const {handler} = flecks.reactRouter;
    const context = await handler.query(createFetchRequest(req, res));
    if (context instanceof Response && [301, 302, 303, 307, 308].includes(context.status)) {
      res.redirect(context.status, context.headers.get('Location'));
      return;
    }
    if ([404].includes(context.statusCode)) {
      res.status(context.statusCode);
      next();
      return;
    }
    next();
  },
  '@flecks/react.roots': async (req, res, flecks) => {
    const {handler} = flecks.reactRouter;
    const context = await handler.query(createFetchRequest(req, res));
    const router = createStaticRouter(handler.dataRoutes, context);
    return [StaticRouterProvider, {context, router}];
  },
  '@flecks/server.up': Flecks.priority(
    async (flecks) => {
      flecks.reactRouter.handler = createStaticHandler(flecks.reactRouter.routes);
    },
    {before: '@flecks/web/server'},
  ),
};
