import {Flecks} from '@flecks/core';
import {Provider} from 'react-redux';

export const hooks = {
  '@flecks/react.providers': Flecks.priority(
    async (req, flecks) => [Provider, {store: flecks.redux}],
    {before: '@flecks/react/router/client'},
  ),
};
