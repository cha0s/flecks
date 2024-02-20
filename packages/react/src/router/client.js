import {performReactRefresh} from 'react-refresh/runtime';
import {createBrowserRouter, matchRoutes, RouterProvider} from 'react-router-dom';
import {createEnhancer, reducer} from 'redux-data-router';

export const hooks = {
  '@flecks/core.hmr.hook': (hook, fleck, {reactRouter}) => {
    if ('@flecks/react/router.routes' === hook) {
      // Routes got HMR'd.
      reactRouter.invalidate();
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
  '@flecks/core.starting': async (flecks) => {
    const {root} = flecks.get('@flecks/react/router');
    const {base: basename} = flecks.get('@flecks/web');
    const routes = await flecks.invokeFleck('@flecks/react/router.routes', root);
    flecks.reactRouter.router = createBrowserRouter(routes, {basename});
  },
  '@flecks/react.roots': async (req, res, {reactRouter: {router}}) => {
    // Determine if any of the initial routes are lazy and update them before creating the router
    // provider so we can hydrate the SSR-rendered content synchronously.
    const lazyMatches = matchRoutes(router.routes, window.location)
      ?.filter(({route}) => route.lazy) || [];
    if (lazyMatches.length > 0) {
      await Promise.all(
        lazyMatches.map(async ({route}) => {
          Object.entries(await route.lazy())
            .forEach(([name, value]) => {
              route[name] = value;
            });
          delete route.lazy;
        }),
      );
    }
    return [RouterProvider, {router}];
  },
  '@flecks/redux.slices': () => ({
    router: reducer,
  }),
  '@flecks/redux.store': ({enhancers}, {reactRouter: {router}}) => {
    enhancers.push(createEnhancer(router));
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
