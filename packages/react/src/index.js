export {default as classnames} from 'classnames';
export {default as PropTypes} from 'prop-types';
export {default as React} from 'react';
export {default as ReactDom} from 'react-dom';
export * from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies, import/no-unresolved
export {default as FlecksContext} from '@flecks/react/context';
export {default as gatherComponents} from './gather-components';
export {default as useEvent} from './hooks/use-event';
export {default as useFlecks} from './hooks/use-flecks';
export {default as usePrevious} from './hooks/use-previous';

export const hooks = {
  '@flecks/core.config': () => ({
    /**
     * React providers.
     */
    providers: ['...'],
    /**
     * Whether to enable server-side rendering.
     */
    ssr: true,
  }),
  '@flecks/web.config': async (req, flecks) => flecks.get('@flecks/react'),
};
