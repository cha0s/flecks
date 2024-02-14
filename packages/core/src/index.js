/* eslint-disable global-require */

const {Flecks} = require('../build/flecks');

export {default as Class} from '../build/class';
export {default as compose} from '../build/compose';
export {default as D} from '../build/debug';
export {default as EventEmitter} from '../build/event-emitter';
export * from '../build/flecks';

export const hooks = Flecks.hooks(require.context('./hooks'));
