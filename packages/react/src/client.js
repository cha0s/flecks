import {D, Hooks} from '@flecks/core';
import {hydrate, render} from '@hot-loader/react-dom';
import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import FlecksContext from '@flecks/react/context';
import root from './root';

const debug = D('@flecks/react/client');

export {FlecksContext};

export default {
  [Hooks]: {
    '@flecks/http/client/up': async (flecks) => {
      const {ssr} = flecks.get('@flecks/react');
      debug('%sing...', ssr ? 'hydrat' : 'render');
      (ssr ? hydrate : render)(
        React.createElement(
          React.StrictMode,
          {},
          [React.createElement(await root(flecks), {key: 'root'})],
        ),
        window.document.getElementById('root'),
      );
      debug('rendered');
    },
  },
};
