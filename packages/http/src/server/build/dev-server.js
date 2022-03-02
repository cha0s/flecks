module.exports = (flecks) => (neutrino) => {
  if ('production' === neutrino.config.get('mode')) {
    return;
  }
  const {
    devHost,
    devPort,
    devPublic,
    devStats,
  } = flecks.get('@flecks/http/server');
  neutrino.config.devServer
    .hot(false)
    .host(devHost)
    .port(devPort)
    .public(devPublic)
    .stats(devStats);
};
