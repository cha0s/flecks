import {Flecks} from '@flecks/core';
import {Provider} from 'react-redux';

export const hooks = {
  '@flecks/react.providers': Flecks.priority(
    (req) => [Provider, {store: req['@flecks/redux']}],
    {before: '@flecks/react/router/server'},
  ),
};
