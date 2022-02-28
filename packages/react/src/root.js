import {D} from '@flecks/core';
import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import FlecksContext from '@flecks/react/context';

const debug = D('@flecks/react/root');

export default async (flecks, req) => {
  const Roots = flecks.invoke('@flecks/react/roots', req);
  debug('roots: %O', Object.keys(Roots));
  const Providers = await flecks.invokeSequentialAsync('@flecks/react/providers', req);
  const FlattenedProviders = [];
  for (let i = 0; i < Providers.length; i++) {
    const Provider = Providers[i];
    if (Provider.length > 0) {
      FlattenedProviders.push(...(Array.isArray(Provider[0]) ? Provider : [Provider]));
    }
  }
  debug('providers: %O', FlattenedProviders);
  return () => {
    const children = Object.entries(Roots)
      .map(([key, Component]) => React.createElement(Component, {key}));
    const AllProviders = [
      [FlecksContext.Provider, {value: flecks}],
    ]
      .concat(FlattenedProviders);
    const RootElements = AllProviders
      .reverse()
      .reduce((children, [Provider, props], i) => [
        React.createElement(
          Provider,
          {key: `@flecks/react/provider(${AllProviders.length - (i + 1)})`, ...props},
          children,
        ),
      ], children);
    return RootElements[0];
  };
};
