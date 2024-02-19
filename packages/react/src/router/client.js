import {
  createBrowserRouter,
  matchRoutes,
  RouterProvider,
} from 'react-router-dom';

import {performReactRefresh} from 'react-refresh/runtime';

export const hooks = {
  '@flecks/core.hmr.hook': (hook, fleck, flecks) => {
    if ('@flecks/react/router.routes' === hook) {
      // Routes got HMR'd.
      flecks.reactRouter.invalidate();
    }
  },
  '@flecks/core.reload': (fleck, config, flecks) => {
    // Root changed in config.
    if (
      '@flecks/react/router' === fleck
      && flecks.get('@flecks/react/router').root !== config.root
    ) {
      throw new Error('root changed');
    }
  },
  '@flecks/react.roots': async (req, res, flecks) => {
    const {root} = flecks.get('@flecks/react/router');
    const routes = await flecks.invokeFleck('@flecks/react/router.routes', root);
    // Determine if any of the initial routes are lazy
    const lazyMatches = matchRoutes(routes, window.location)?.filter(({route}) => route.lazy);
    // Load the lazy matches and update the routes before creating the router
    // so we can hydrate the SSR-rendered content synchronously.
    if (lazyMatches && lazyMatches?.length > 0) {
      await Promise.all(
        lazyMatches.map(async (m) => {
          Object.entries(await m.route.lazy())
            .forEach(([name, value]) => {
              m.route[name] = value;
            });
          delete m.route.lazy;
        }),
      );
    }
    flecks.reactRouter.router = createBrowserRouter(routes);
    return [RouterProvider, {router: flecks.reactRouter.router}];
  },
};

export const mixin = (Flecks) => class FlecksWithReactRouterClient extends Flecks {

  constructor(runtime) {
    super(runtime);
    const flecks = this;
    let debounceRefresh;
    this.reactRouter = {
      invalidate() {
        if (debounceRefresh) {
          return;
        }
        // Sorry.
        debounceRefresh = setTimeout(() => {
          const {root} = flecks.get('@flecks/react/router');
          Promise.resolve(flecks.invokeFleck('@flecks/react/router.routes', root))
            .then((routes) => {
              // eslint-disable-next-line no-underscore-dangle
              this.router._internalSetRoutes(routes);
              performReactRefresh();
              debounceRefresh = undefined;
            });
        }, 10);
      },
      router: undefined,
    };
  }

};
