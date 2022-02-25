import {ensureUniqueReduction, Flecks, Hooks} from '@flecks/core';
import {Provider} from 'react-redux';

import configureStore, {createReducer} from '../store';
import localStorageEnhancer from './local-storage';

export default {
  [Hooks]: {
    '@flecks/react/providers': async (req, flecks) => {
      const slices = await ensureUniqueReduction(flecks, '@flecks/redux/slices');
      const reducer = createReducer(flecks, slices);
      // Hydrate from server.
      const {preloadedState} = flecks.get('@flecks/redux/client');
      const store = await configureStore(flecks, reducer, {preloadedState});
      flecks.set('$flecks/redux/store', store);
      return [Provider, {store}];
    },
    '@flecks/redux/store': ({enhancers}) => {
      // Hydrate from and subscribe to localStorage.
      enhancers.push(localStorageEnhancer);
    },
    '@flecks/socket/packets.decorate': (
      Flecks.decorate(require.context('./packets/decorators', false, /\.js$/))
    ),
  },
};
