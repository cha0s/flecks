/* eslint-disable import/no-extraneous-dependencies */
const config = require('@flecks/fleck/server/build/fleck.neutrinorc');
const copy = require('@neutrinojs/copy');
/* eslint-enable import/no-extraneous-dependencies */

config.use.push(({config}) => {
  config.entryPoints.delete('build/template');
});

config.use.push(
  copy({
    patterns: [
      {
        from: 'src/build/template.ejs',
        to: 'build/template.ejs',
      },
    ],
  }),
);

module.exports = config;
