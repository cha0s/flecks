import FlecksContext from './context';

export {default as classnames} from 'classnames';
export {default as PropTypes} from 'prop-types';
export {default as React} from 'react';
export {default as ReactDom} from 'react-dom';
export * from 'react';

export * from './react-hooks';

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
    /**
     * Whether to wrap the React root with `React.StrictMode`.
     */
    strictMode: true,
  }),
  '@flecks/react.providers': (req, res, flecks) => [FlecksContext.Provider, {value: flecks}],
  '@flecks/web.config': async (req, flecks) => flecks.get('@flecks/react'),
};
