import {Hooks} from '@flecks/core';

export {default as ReactDom} from '@hot-loader/react-dom';
export {default as classnames} from 'classnames';
export {default as PropTypes} from 'prop-types';
export {default as React} from 'react';
export * from 'react';
export {hot} from 'react-hot-loader';

// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
export {default as FlecksContext} from '@flecks/react/context';
export {default as useEvent} from './hooks/use-event';
export {default as useFlecks} from './hooks/use-flecks';
export {default as usePrevious} from './hooks/use-previous';

export default {
  [Hooks]: {
    '@flecks/core.config': () => ({
      ssr: true,
    }),
  },
};
