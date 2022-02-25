import {Hooks} from '@flecks/core';
import {StaticRouter} from 'react-router-dom/server';

export default {
  [Hooks]: {
    '@flecks/react/providers': (req, flecks) => (
      flecks.get('@flecks/react.ssr') ? [StaticRouter, {location: req.url}] : []
    ),
  },
};
