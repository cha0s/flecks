export {glob} from 'glob';

export {JsonStream, transform} from '../../build/stream';

export const hooks = {
  '@flecks/web.config': async (req, flecks) => ({
    '@flecks/core': {
      id: flecks.get('@flecks/core.id'),
    },
  }),
};
