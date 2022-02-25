import {createReduxHistoryContext} from 'redux-first-history';
import {createBrowserHistory, createMemoryHistory} from 'history';

export const history = 'undefined' === typeof window
  ? createMemoryHistory()
  : createBrowserHistory();

export const {
  createReduxHistory,
  routerMiddleware,
  routerReducer,
} = createReduxHistoryContext({
  history,
  reduxTravelling: true,
});
