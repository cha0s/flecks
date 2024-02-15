export const hooks = {
  /**
   * Define React Providers.
   *
   * Note: `req` will be only be defined when server-side rendering.
   * @param {http.ClientRequest} req The HTTP request object.
   * @invoke SequentialAsync
   * @returns {[ReactContextProvider<Props>, Props]} An array where the first element is a React
   * context provider and the second element is the `props` passed to the context provider.
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
   * @invoke Async
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
};

