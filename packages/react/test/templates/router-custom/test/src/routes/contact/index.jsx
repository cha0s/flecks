import {React} from '@flecks/react';
import {Outlet} from '@flecks/react/router';

export const hoist = 1;

export function Component() {
  return <div className="test-contacts"><Outlet /></div>;
}
