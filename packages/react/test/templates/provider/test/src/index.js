import {Context} from './context';
import {Component} from './root';

export const hooks = {
  '@flecks/react.providers': () => [Context.Provider, {value: 'foobar'}],
  '@flecks/react.roots': () => Component,
};
