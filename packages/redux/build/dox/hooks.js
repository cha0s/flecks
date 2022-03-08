import {Hooks} from '@flecks/core';

export default {
  [Hooks]: {
    /**
     * Define side-effects to run against Redux actions.
     */
    '@flecks/redux.effects': () => ({
      someActionName: (store, action, flecks) => {
        // Runs when `someActionName` actions are dispatched.
      },
    }),
    /**
     * Define root-level reducers for the Redux store.
     */
    '@flecks/redux.reducers': () => {
      return (state, action) => {
        // Whatever you'd like.
        return state;
      };
    },
    /**
     * Define Redux slices.
     *
     * See: https://redux-toolkit.js.org/api/createSlice
     */
    '@flecks/redux.slices': () => {
      const something = createSlice(
        // ...
      );
      return {
        something: something.reducer,
      };
    },
    /**
     * Modify Redux store configuration.
     * @param {Object} options A mutable object with keys for enhancers and middleware.
     */
    '@flecks/redux.store': (options) => {
      options.enhancers.splice(someIndex, 1);
      options.middleware.push(mySpecialMiddleware);
    },
  },
};

