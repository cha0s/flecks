import {Flecks, Hooks} from '@flecks/core';

export * from '@reduxjs/toolkit';
export * from 'react-redux';

export * from './actions';

export default {
  [Hooks]: {
    '@flecks/socket/packets': Flecks.provide(require.context('./packets', false, /\.js$/)),
  },
};
