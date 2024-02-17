import {D} from '@flecks/core';
import {createRoot, hydrateRoot} from 'react-dom/client';

import {createRootElement} from './create-root-element';

const debug = D('@flecks/react/client');

export const hooks = {
  '@flecks/web/client.up': async (container, flecks) => {
    const {ssr} = flecks.get('@flecks/react');
    debug('%sing...', ssr ? 'hydrat' : 'render');
    const RootElement = await createRootElement(flecks);
    // API™.
    if (ssr) {
      hydrateRoot(container, RootElement);
    }
    else {
      createRoot(container).render(RootElement);
    }
    debug('rendered');
  },
};
