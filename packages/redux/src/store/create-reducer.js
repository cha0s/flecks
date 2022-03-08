import {combineReducers} from '@reduxjs/toolkit';
import reduceReducers from 'reduce-reducers';

export default (flecks, slices) => {
  let reducers = flecks.invokeFlat('@flecks/redux.reducers');
  if (Object.keys(slices).length > 0) {
    reducers = reducers.concat(combineReducers(slices));
  }
  return reduceReducers(null, ...reducers);
};
