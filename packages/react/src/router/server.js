import {StaticRouter} from 'react-router-dom/server';

export const hooks = {
  '@flecks/react.providers': (req, flecks) => (
    flecks.get('@flecks/react.ssr') ? [StaticRouter, {location: req.url}] : []
  ),
};
