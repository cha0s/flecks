import {createRoutesFromFiletree, createRoutesFromContext} from './filetree-router';

export * from 'react-router-dom';

export {createRoutesFromFiletree, createRoutesFromContext};

export const hooks = {
  '@flecks/react/router.routes': () => createRoutesFromContext(require.context('./routes')),
  '@flecks/core.config': () => ({
    /**
     * Select the root routes. Implement `@flecks/react/router.routes` in e.g. `@your/fleck` and
     * set `root` to `@your/fleck` to render your routes.
     */
    root: '@flecks/react/router',
  }),
  '@flecks/web.config': (req, flecks) => ({
    root: flecks.get('@flecks/react/router').root,
  }),
};
