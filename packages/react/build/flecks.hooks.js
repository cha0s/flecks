export const hooks = {
  /**
   * Define React Providers.
   *
   * Note: `req` will be only be defined when server-side rendering.
   * @param {http.ClientRequest} req The HTTP request object.
   * @invoke SequentialAsync
   * @returns {ReactContextProvider | [ReactContextProvider<Props>, Props]} A React context
   * provider or an array where the first element is a React context provider and the second
   * element is the `props` passed to the provider.
   */
  '@flecks/react.providers': (req) => {
    return req ? serverSideProvider(req) : [SomeContext.Provider, {value: 'whatever'}];
  },
  /**
   * Define root-level React components that are mounted as siblings on `#main`.
   * Note: `req` will be only be defined when server-side rendering.
   *
   * Return either a React component or an array whose elements must either be a React component
   * or an array of two elements where the first element is the component and the second element
   * is the props passed to the component.
   * @param {http.ClientRequest} req The HTTP request object.
   * @returns {Component | [Component<Props>, Props]} A React component or an array where the first
   * element is a React component and the second element is the `props` passed to the component.
   * @invoke SequentialAsync
   */
  '@flecks/react.roots': (req) => {
    // Note that we're not returning `<Component />`, but `Component`.
    return [
      Component,
      [SomeOtherComponent, {prop: 'value'}]
    ];
    // You can also just:
    return Component;
  },
  /**
   * Provide routes for React Router.
   *
   * You can also build routes from a file structure using e.g.:
   *
   * ```js
   * import {createRoutesFromContext} from '@flecks/react/router';
   *
   * export const hooks = {
   *   '@flecks/react/router.routes': () => (
   *     createRoutesFromContext(require.context('./routes'))
   *   ),
   * };
   * ```
   *
   * See [the documentation page on routing](../react#routing) for more details.
   *
   * @returns {RouteObject[]} An array of React Router route objects.
   */
  '@flecks/react/router.routes': () => {
    // You can also just return routes how React Router expects:
    return [
      {
        path: '/',
        Component: function Component() {
          return <p>This is the root route</p>;
        },
      },
      {
        path: '/team',
        children: [
          {
            path: ':teamId',
            Component: function Component() {
              const {teamId} = useParams();
              return <p>This is team {teamId}.</p>;
            },
          },
          {
            index: true,
            Component: function Component() {
              return <p>This is the team overview.</p>;
            },
          },
        ],
      },
      {
        path: '/about',
        Component: function Component() {
          return <p>This is the about page</p>;
        },
      },
    ];
  }
};

