import {React} from '@flecks/react';

import PassportLocalLogin from './login';

export const hooks = {
  '@flecks/passport-react.strategies': () => ({
    Email: React.createElement(PassportLocalLogin),
  }),
};
