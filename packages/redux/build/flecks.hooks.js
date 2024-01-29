export const hooks = {
  /**
   * Define side-effects to run against Redux actions.
   * @invoke SequentialAsync
   */
  '@flecks/redux.effects': () => ({
    someActionName: (store, action) => {
      // Runs when `someActionName` actions are dispatched.
    },
  }),
  /**
   * Define root-level reducers for the Redux store.
   * @invoke SequentialAsync
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
   * @invoke MergeUniqueAsync
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
   * @invoke SequentialAsync
   */
  '@flecks/redux.store': (options) => {
    options.enhancers.splice(someIndex, 1);
    options.middleware.push(mySpecialMiddleware);
  },
};

