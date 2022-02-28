import {D, ensureUniqueReduction, Hooks} from '@flecks/core';
import {Provider} from 'react-redux';

import {hydrateServer} from './actions';
import createReducer from './store/create-reducer';
import configureStore from './store';

const debug = D('@flecks/redux/server');

export default {
  [Hooks]: {
    '@flecks/http/server/request.route': (flecks) => async (req, res, next) => {
      const slices = await ensureUniqueReduction(flecks, '@flecks/redux/slices');
      const reducer = createReducer(flecks, slices);
      const preloadedState = reducer(undefined, hydrateServer({flecks, req}));
      debug(
        'creating redux store with slices(%O) and state(%O)',
        Object.keys(slices),
        preloadedState,
      );
      req.redux = await configureStore(flecks, reducer, {preloadedState});
      next();
    },
    '@flecks/http/config': async (req) => ({
      '@flecks/redux/client': {
        preloadedState: req.redux.getState(),
      },
    }),
    '@flecks/react/providers': (req) => [Provider, {store: req.redux}],
  },
};
