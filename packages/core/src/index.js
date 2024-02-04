/* eslint-disable global-require */

module.exports = {
  Class: require('../build/class'),
  compose: require('../build/compose'),
  D: require('../build/debug'),
  EventEmitter: require('../build/event-emitter'),
  ...require('../build/flecks'),
  hooks: {
    '@flecks/web.config': async (req, flecks) => ({
      id: flecks.get('@flecks/core.id'),
    }),
  },
};
