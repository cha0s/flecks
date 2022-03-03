module.exports = (flecks) => (neutrino) => {
  if ('production' === neutrino.config.get('mode')) {
    return;
  }
  const {
    devHost,
    devPort,
    devPublic,
    devStats,
    port,
  } = flecks.get('@flecks/http/server');
  neutrino.config.devServer
    .hot(false)
    .host(devHost)
    .port(devPort || (port + 1))
    .public(devPublic)
    .stats(devStats);
};
