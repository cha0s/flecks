const Build = require('@flecks/build/build/build');

exports.hook = async (flecks) => {
  const {config} = await Build.from({
    config: flecks.config,
    platforms: ['client', '!server'],
  });
  return JSON.stringify(config);
};
