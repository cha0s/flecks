const {version} = require('../package.json');

export const hooks = {
  '@flecks/web.config': async (req, flecks) => {
    const {appMountId, title} = flecks.get('@flecks/web');
    return {appMountId, title, version};
  },
};
