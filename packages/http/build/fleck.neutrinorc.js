// eslint-disable-next-line import/no-extraneous-dependencies
const copy = require('@neutrinojs/copy');

module.exports = (async () => {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  const config = await require('@flecks/fleck/server/build/fleck.neutrinorc');
  config.use.push(({config}) => {
    config.entryPoints.delete('build/template');
  });
  config.use.push(
    copy({
      copyUnmodified: true,
      patterns: [
        {
          from: 'src/build/template.ejs',
          to: 'build/template.ejs',
        },
      ],
    }),
  );
  return config;
})();
