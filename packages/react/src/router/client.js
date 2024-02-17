import {
  createBrowserRouter,
  matchRoutes,
  RouterProvider,
} from 'react-router-dom';

export const hooks = {
  '@flecks/react.roots': async (req, res, flecks) => {
    const {routes} = flecks.reactRouter;
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
    const router = createBrowserRouter(routes);
    return [RouterProvider, {router}];
  },
};
