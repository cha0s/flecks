const {stat, unlink} = require('fs/promises');
const {join} = require('path');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

exports.hook = async (configs, env, argv, flecks) => {
  const isProduction = 'production' === argv.mode;
  // Only build vendor in dev.
  if (configs['web-vendor']) {
    if (isProduction) {
      delete configs['web-vendor'];
    }
    // Only build if something actually changed.
    const dll = flecks.get('@flecks/web.dll');
    if (dll.length > 0) {
      const manifest = join(
        FLECKS_CORE_ROOT,
        'node_modules',
        '.cache',
        '@flecks',
        'web',
        'vendor',
        'manifest.json',
      );
      let timestamp = 0;
      try {
        const stats = await stat(manifest);
        timestamp = stats.mtime;
      }
      // eslint-disable-next-line no-empty
      catch (error) {}
      let latest = 0;
      for (let i = 0; i < dll.length; ++i) {
        const path = dll[i];
        try {
          // eslint-disable-next-line no-await-in-loop
          const stats = await stat(join(FLECKS_CORE_ROOT, 'node_modules', path));
          if (stats.mtime > latest) {
            latest = stats.mtime;
          }
        }
        // eslint-disable-next-line no-empty
        catch (error) {}
      }
      if (timestamp > latest) {
        delete configs['web-vendor'];
      }
      else if (timestamp > 0) {
        await unlink(manifest);
      }
    }
  }
  // Bail if there's no web server build.
  const {server} = configs;
  if (!configs.web || !server) {
    return;
  }
  // Bail if the build isn't watching.
  if (!process.argv.find((arg) => 'watch' === arg)) {
    return;
  }
  // Send the build details to the server node process so it can spawn the dev server.
  const plugin = server.plugins.find(({pluginName}) => pluginName === 'StartServerPlugin');
  if (plugin) {
    plugin.options.env.FLECKS_WEB_DEV_SERVER = (
      await flecks.resolveBuildConfig('fleckspack.config.js')
    );
    // Remove the build config since we're handing off to the server.
    delete configs.web;
  }
};
