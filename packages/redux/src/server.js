import {D} from '@flecks/core';
import {Provider} from 'react-redux';

import {hydrateServer} from './actions';
import createReducer from './store/create-reducer';
import configureStore from './store';

const debug = D('@flecks/redux/server');
const debugSilly = debug.extend('silly');

export const hooks = {
  '@flecks/web/server.request.route': (flecks) => async (req, res, next) => {
    const slices = await flecks.invokeMergeUnique('@flecks/redux.slices');
    const reducer = createReducer(flecks, slices);
    // Let the slices have a(n async) chance to hydrate with server data.
    await Promise.all(
      Object.values(slices).map(({hydrateServer}) => hydrateServer?.(req, flecks)),
    );
    const preloadedState = reducer(undefined, hydrateServer({flecks, req}));
    debugSilly(
      'creating redux store with slices(%O) and state(%O)',
      Object.keys(slices),
      preloadedState,
    );
    req.redux = await configureStore(flecks, reducer, {preloadedState});
    next();
  },
  '@flecks/web.config': async (req) => ({
    '@flecks/redux/client': {
      preloadedState: req.redux.getState(),
    },
  }),
  '@flecks/react.providers': (req) => [Provider, {store: req.redux}],
};
