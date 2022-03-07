import {Hooks} from '@flecks/core';

export default {
  [Hooks]: {
    /**
     * Define React Providers.
     *
     * Note: `req` will be only be defined when server-side rendering.
     * @param {http.ClientRequest} req The HTTP request object.
     */
    '@flecks/react/providers': (req) => {
      // Generally it makes more sense to separate client and server concerns using platform
      // naming conventions, but this is just a small contrived example.
      return req ? serverSideProvider(req) : clientSideProvider();
    },
    /**
     * Define root-level React components that are mounted as siblings on `#main`.
     * Note: `req` will be only be defined when server-side rendering.
     * @param {http.ClientRequest} req The HTTP request object.
     */
    '@flecks/react/roots': (req) => {
      // Note that we're not returning `<Component />`, but `Component`.
      return Component;
    },
  },
};

