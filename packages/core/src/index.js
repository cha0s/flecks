import {Hooks} from './flecks';

export {default as Class} from './class';
export {default as compose} from './compose';
export {default as D} from './debug';
export {default as ensureUniqueReduction} from './ensure-unique-reduction';
export {default as EventEmitter} from './event-emitter';
export {
  default as Flecks,
  ById,
  ByType,
  Hooks,
} from './flecks';

export default {
  [Hooks]: {
    '@flecks/core.config': () => ({
      /**
       * The ID of your application.
       */
      id: 'flecks',
    }),
  },
};
