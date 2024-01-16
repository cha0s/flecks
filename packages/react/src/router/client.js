// eslint-disable-next-line import/no-extraneous-dependencies
import {createReduxHistory, history} from '@flecks/react/router/context';
import {unstable_HistoryRouter as HistoryRouter} from 'react-router-dom';
import {HistoryRouter as ReduxHistoryRouter} from './history-router';

export const hooks = {
  '@flecks/react.providers': (req, flecks) => (
    flecks.fleck('@flecks/redux')
      ? [ReduxHistoryRouter, {history: createReduxHistory(flecks.redux)}]
      : [HistoryRouter, {history}]
  ),
};
