import {D} from '@flecks/core';
import {hydrate, render} from '@hot-loader/react-dom';
import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import FlecksContext from '@flecks/react/context';
import root from './root';

const debug = D('@flecks/react/client');

export {FlecksContext};

export const hooks = {
  '@flecks/web/client.up': async (flecks) => {
    const {ssr} = flecks.get('@flecks/react');
    const {appMountId} = flecks.get('@flecks/web/client');
    debug('%sing...', ssr ? 'hydrat' : 'render');
    (ssr ? hydrate : render)(
      React.createElement(
        React.StrictMode,
        {},
        [React.createElement(await root(flecks), {key: 'root'})],
      ),
      window.document.getElementById(appMountId),
    );
    debug('rendered');
  },
};
