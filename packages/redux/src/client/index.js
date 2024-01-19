import {Flecks} from '@flecks/core';
import {Provider} from 'react-redux';

import configureStore, {createReducer} from '../store';
import localStorageEnhancer from './local-storage';

export const hooks = {
  '@flecks/react.providers': Flecks.priority(
    async (req, flecks) => {
      const slices = await flecks.invokeMergeUnique('@flecks/redux.slices');
      const reducer = createReducer(flecks, slices);
      // Hydrate from server.
      const {preloadedState} = flecks.get('@flecks/redux/client');
      const store = await configureStore(flecks, reducer, {preloadedState});
      flecks.redux = store;
      return [Provider, {store}];
    },
    {before: '@flecks/react/router/client'},
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
