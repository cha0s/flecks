export const hooks = {
  /**
   * Define React Providers.
   *
   * Note: `req` will be only be defined when server-side rendering.
   * @param {http.ClientRequest} req The HTTP request object.
   */
  '@flecks/react.providers': (req) => {
    // Generally it makes more sense to separate client and server concerns using platform
    // naming conventions, but this is just a small contrived example.
    return req ? serverSideProvider(req) : clientSideProvider();
  },
  /**
   * Define root-level React components that are mounted as siblings on `#main`.
   * Note: `req` will be only be defined when server-side rendering.
   *
   * Return either a React component or an array whose elements must either be a React component
   * or an array of two elements where the first element is the component and the second element
   * is the props passed to the component.
   * @param {http.ClientRequest} req The HTTP request object.
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

