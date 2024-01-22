import {Flecks} from '@flecks/core';

export * from '@reduxjs/toolkit';
export * from 'react-redux';

export * from './actions';

export const hooks = {
  '@flecks/socket.packets': Flecks.provide(require.context('./packets', false, /\.js$/)),
  '@flecks/web.config': async (req) => ({
    preloadedState: req.redux.getState(),
  }),
};
