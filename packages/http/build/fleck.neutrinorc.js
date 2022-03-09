// eslint-disable-next-line import/no-extraneous-dependencies
const copy = require('@neutrinojs/copy');

module.exports = (async () => {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  const config = await require('@flecks/fleck/server/build/fleck.neutrinorc');
  config.use.push(({config}) => {
    config.entryPoints.delete('server/build/template');
  });
  config.use.push(
    copy({
      copyUnmodified: true,
      patterns: [
        {
          from: 'src/server/build/template.ejs',
          to: 'server/build/template.ejs',
        },
      ],
    }),
  );
  return config;
})();
