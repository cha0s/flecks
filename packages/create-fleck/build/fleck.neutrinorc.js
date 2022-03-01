/* eslint-disable import/no-extraneous-dependencies */
const {chmod} = require('fs');
const {join} = require('path');

const banner = require('@neutrinojs/banner');
const copy = require('@neutrinojs/copy');

module.exports = (async () => {
  // eslint-disable-next-line global-require
  const config = await require('@flecks/fleck/server/build/fleck.neutrinorc');

  config.use.push(banner({
    banner: '#!/usr/bin/env node',
    include: /^cli\.js$/,
    pluginId: 'shebang',
    raw: true,
  }));

  config.use.push(({config}) => {
    config
      .plugin('executable')
      .use(class Executable {

        // eslint-disable-next-line class-methods-use-this
        apply(compiler) {
          compiler.hooks.afterEmit.tapAsync(
            'Executable',
            (compilation, callback) => {
              chmod(join(__dirname, '..', 'dist', 'cli.js'), 0o755, callback);
            },
          );
        }

      });
  });

  config.use.push(
    copy({
      copyUnmodified: true,
      patterns: [
        {
          from: 'template',
          to: 'template',
        },
      ],
    }),
  );

  return config;

})();
