export {default as Class} from '../build/class';
export {default as compose} from '../build/compose';
export {default as D} from '../build/debug';
export {default as EventEmitter} from '../build/event-emitter';
export {
  ById,
  ByType,
  Flecks,
} from '../build/flecks';

export const hooks = {
  '@flecks/web.config': async (req, flecks) => ({
    id: flecks.get('@flecks/core.id'),
  }),
};
