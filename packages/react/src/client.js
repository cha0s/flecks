import {D} from '@flecks/core';
import React from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';

// eslint-disable-next-line import/no-extraneous-dependencies
import FlecksContext from '@flecks/react/context';
import root from './root';

const debug = D('@flecks/react/client');

export {FlecksContext};

export const hooks = {
  '@flecks/web/client.up': async (flecks) => {
    const {ssr} = flecks.get('@flecks/react');
    const {appMountId} = flecks.get('@flecks/web');
    const container = window.document.getElementById(appMountId);
    debug('%sing...', ssr ? 'hydrat' : 'render');
    const RootComponent = React.createElement(
      React.StrictMode,
      {},
      [React.createElement(await root(flecks), {key: 'root'})],
    );
    // API™.
    if (ssr) {
      hydrateRoot(container, RootComponent);
    }
    else {
      createRoot(container).render(RootComponent);
    }
    debug('rendered');
  },
};
