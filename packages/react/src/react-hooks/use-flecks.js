import FlecksContext from '@flecks/react/context';
import {useContext, useEffect, useState} from 'react';

export default () => {
  const [, setId] = useState(0);
  const flecks = useContext(FlecksContext);
  // Hack... force flecks update on HMR.
  useEffect(() => {
    if (!flecks.hooks['@flecks/core.hmr']) {
      flecks.hooks['@flecks/core.hmr'] = [];
    }
    flecks.hooks['@flecks/core.hmr'].push({
      plugin: '@flecks/react/hmr',
      fn: () => {
        setId(Math.random());
      },
    });
  }, [flecks]);
  return flecks;
};
