import {Hooks} from '@flecks/core';
// eslint-disable-next-line import/no-extraneous-dependencies
import {routerMiddleware, routerReducer} from '@flecks/react/router/context';

export * from 'react-router-dom';
export * from 'redux-first-history';

export default {
  [Hooks]: {
    '@flecks/redux.slices': () => ({
      router: routerReducer,
    }),
    '@flecks/redux.store': (options) => {
      options.middleware.push(routerMiddleware);
    },
  },
};
