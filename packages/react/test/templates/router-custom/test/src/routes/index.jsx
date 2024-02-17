import {React} from '@flecks/react';
import {Outlet} from '@flecks/react/router';

export function Component() {
  return <div className="custom-route"><Outlet /></div>;
}
