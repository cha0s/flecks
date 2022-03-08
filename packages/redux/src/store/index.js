import {configureStore as configureStoreR} from '@reduxjs/toolkit';

import effectsMiddleware from './middleware/effects';

export {default as createReducer} from './create-reducer';

export default async function configureStore(flecks, reducer, {preloadedState}) {
  const options = {
    enhancers: [
      '@flecks/redux/defaultEnhancers',
    ],
    middleware: [
      '@flecks/redux/defaultMiddleware',
      effectsMiddleware(flecks),
    ],
  };
  flecks.invokeFlat('@flecks/redux.store', options);
  return configureStoreR({
    enhancers: (defaultEnhancers) => {
      const index = options.enhancers.indexOf('@flecks/redux/defaultEnhancers');
      if (-1 !== index) {
        options.enhancers.splice(index, 1, ...defaultEnhancers);
      }
      return options.enhancers;
    },
    middleware: (getDefaultMiddleware) => {
      const index = options.middleware.indexOf('@flecks/redux/defaultMiddleware');
      if (-1 !== index) {
        options.middleware.splice(index, 1, ...getDefaultMiddleware({
          thunk: {
            extraArgument: flecks,
          },
        }));
      }
      return options.middleware;
    },
    preloadedState,
    reducer,
  });
}
