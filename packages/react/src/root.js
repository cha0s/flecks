import {D} from '@flecks/core';
import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import FlecksContext from '@flecks/react/context';

import gatherComponents from './gather-components';

const debug = D('@flecks/react/root');
const debugSilly = debug.extend('silly');

export default async (flecks, req) => {
  const Roots = await flecks.invokeAsync('@flecks/react.roots', req);
  debugSilly('roots: %O', Roots);
  const Providers = await flecks.invokeSequentialAsync('@flecks/react.providers', req);
  const FlattenedProviders = [];
  for (let i = 0; i < Providers.length; i++) {
    const Provider = Providers[i];
    if (Provider.length > 0) {
      FlattenedProviders.push(...(Array.isArray(Provider[0]) ? Provider : [Provider]));
    }
  }
  debugSilly('providers: %O', FlattenedProviders);
  return () => {
    const RootElements = [[FlecksContext.Provider, {value: flecks}]]
      .concat(FlattenedProviders)
      .reduceRight((children, [Provider, props], i) => [
        React.createElement(
          Provider,
          // eslint-disable-next-line react/no-array-index-key
          {key: `@flecks/react/provider(${i})`, ...props},
          children,
        ),
      ], gatherComponents(Roots));
    return RootElements[0];
  };
};
