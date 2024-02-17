import {React} from '@flecks/react';

export async function lazy() {
  return {
    Component() {
      return <p className="lazy" />;
    },
  };
}
