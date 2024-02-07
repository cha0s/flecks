/* eslint-disable global-require */

const {join} = require('path');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

module.exports = {
  Class: require('../build/class'),
  compose: require('../build/compose'),
  D: require('../build/debug'),
  EventEmitter: require('../build/event-emitter'),
  ...require('../build/flecks'),
  hooks: {
    '@flecks/core.hmr': (path, config, flecks) => {
      if (path !== join(FLECKS_CORE_ROOT, 'build', 'flecks.yml')) {
        return;
      }
      Object.entries(flecks.constructor.dealiasedConfig(config))
        .forEach(([fleck, value]) => {
          if (JSON.stringify(flecks.originalConfig[fleck]) !== JSON.stringify(value)) {
            const fleckList = flecks.flecksImplementing('@flecks/core.reload');
            for (let i = 0; i < fleckList.length; ++i) {
              try {
                flecks.invokeFleck('@flecks/core.reload', fleckList[i], fleck, value);
              }
              catch (error) {
                throw new Error(`'${fleck}' aborted reload: ${error.name}: ${error.message}`);
              }
            }
            flecks.originalConfig[fleck] = value;
            flecks.configureFleckDefaults(fleck);
          }
        });
    },
    '@flecks/web.config': async (req, flecks) => ({
      id: flecks.get('@flecks/core.id'),
    }),
  },
};
