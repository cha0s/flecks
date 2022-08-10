export {default as Class} from './class';
export {default as compose} from './compose';
export {default as D} from './debug';
export {default as EventEmitter} from './event-emitter';
export {
  default as Flecks,
  ById,
  ByType,
} from './flecks';

export const hooks = {
  '@flecks/core.config': () => ({
    /**
     * The ID of your application.
     */
    id: 'flecks',
  }),
};
