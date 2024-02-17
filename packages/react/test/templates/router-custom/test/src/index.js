import {createRoutesFromContext} from '@flecks/react/router';

export const hooks = {
  '@flecks/react/router.routes': () => createRoutesFromContext(require.context('./routes')),
};
