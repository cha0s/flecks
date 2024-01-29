import {Flecks} from '@flecks/core';

import configureStore, {createReducer} from '../store';
import localStorageEnhancer from './local-storage';

export const hooks = {
  '@flecks/web/client.up': Flecks.priority(
    async (flecks) => {
      const slices = await flecks.invokeMergeUniqueAsync('@flecks/redux.slices');
      const reducer = await createReducer(flecks, slices);
      // Hydrate from server.
      const {preloadedState} = flecks.get('@flecks/redux');
      const store = await configureStore(flecks, reducer, {preloadedState});
      flecks.redux = store;
    },
    {before: '@flecks/react/client'},
  ),
  '@flecks/redux.store': ({enhancers}) => {
    // Hydrate from and subscribe to localStorage.
    enhancers.push(localStorageEnhancer);
  },
  '@flecks/socket.packets.decorate': (
    Flecks.decorate(require.context('./packets/decorators', false, /\.js$/))
  ),
};

export const mixin = (Flecks) => class FlecksWithRedux extends Flecks {

  redux;

};
