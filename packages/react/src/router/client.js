// eslint-disable-next-line import/no-extraneous-dependencies
import {createReduxHistory, history} from '@flecks/react/router/context';
import {unstable_HistoryRouter as HistoryRouter} from 'react-router-dom';
import {HistoryRouter as ReduxHistoryRouter} from 'redux-first-history/rr6';

export const hooks = {
  '@flecks/react.providers': (req, flecks) => (
    flecks.fleck('@flecks/redux')
      ? [ReduxHistoryRouter, {history: createReduxHistory(flecks.get('$flecks/redux.store'))}]
      : [HistoryRouter, {history}]
  ),
};
