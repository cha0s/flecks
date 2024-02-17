import {D} from '@flecks/core';
import React from 'react';

const debug = D('@flecks/react/root');
const debugSilly = debug.extend('silly');

export async function createRootElement(flecks, req, res) {
  const Providers = {};
  const implementingProvider = flecks.flecksImplementing('@flecks/react.providers');
  for (let i = 0; i < implementingProvider.length; ++i) {
    const fleck = implementingProvider[i];
    const implementation = flecks.fleckImplementation(fleck, '@flecks/react.providers');
    // eslint-disable-next-line no-await-in-loop
    Providers[fleck] = await implementation(req, res, flecks);
  }
  debugSilly('providers: %O', Providers);
  const Roots = {};
  const implementingRoot = flecks.flecksImplementing('@flecks/react.roots');
  for (let i = 0; i < implementingRoot.length; ++i) {
    const fleck = implementingRoot[i];
    const implementation = flecks.fleckImplementation(fleck, '@flecks/react.roots');
    // eslint-disable-next-line no-await-in-loop
    Roots[fleck] = await implementation(req, res, flecks);
  }
  debugSilly('roots: %O', Roots);
  const RootElements = Object.entries(Roots)
    .filter(([, ComponentOrTuple]) => ComponentOrTuple)
    .map(([fleck, ComponentOrTuple]) => {
      let Root;
      let props = {};
      if (Array.isArray(ComponentOrTuple)) {
        [Root, props] = ComponentOrTuple;
      }
      else {
        Root = ComponentOrTuple;
      }
      return React.createElement(Root, {key: `@flecks/react/root(${fleck})`, ...props});
    });
  let [RootElement] = Object.entries(Providers)
    .filter(([, ComponentOrTuple]) => ComponentOrTuple)
    .reduceRight(
      (children, [fleck, ComponentOrTuple]) => {
        let Provider;
        let props = {};
        if (Array.isArray(ComponentOrTuple)) {
          [Provider, props] = ComponentOrTuple;
        }
        else {
          Provider = ComponentOrTuple;
        }
        return [
          React.createElement(
            Provider,
            // eslint-disable-next-line react/no-array-index-key
            {key: `@flecks/react/provider(${fleck})`, ...props},
            children,
          ),
        ];
      },
      RootElements,
    );
  const {strictMode} = flecks.get('@flecks/react');
  if (strictMode) {
    RootElement = React.createElement(
      React.StrictMode,
      {},
      [React.cloneElement(RootElement, {key: '@flecks/react.strictMode'})],
    );
  }
  return RootElement;
}
