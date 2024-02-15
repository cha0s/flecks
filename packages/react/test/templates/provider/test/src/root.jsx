import {useContext, React} from '@flecks/react';

import {Context} from './context';

export function Component() {
  const foobar = useContext(Context);
  return <div className="provider-test">{foobar}</div>;
}
