import throttle from 'lodash.throttle';

import {hydrateLocalStorage, storeLocalStorage} from '../actions';

const hasStorage = (() => {
  try {
    window.localStorage.setItem('__redux-test', true);
    window.localStorage.removeItem('__redux-test');
    return true;
  }
  catch (error) {
    return false;
  }
})();

const localStorageEnhancer = (createStore) => (reducer, initialState, enhancer) => {
  const store = createStore(reducer, initialState, enhancer);
  if (!hasStorage) {
    return store;
  }
  // Hydrate.
  const storage = JSON.parse(window.localStorage.getItem('@flecks/redux/state'));
  if (storage) {
    setTimeout(() => {
      store.dispatch(hydrateLocalStorage(storage));
    }, 0);
  }
  // Subscribes to changes.
  store.subscribe(
    throttle(
      () => (
        window.localStorage.setItem(
          '@flecks/redux/state',
          JSON.stringify(reducer(store.getState(), storeLocalStorage())),
        )
      ),
      1000,
    ),
  );
  return store;
};

export default localStorageEnhancer;
