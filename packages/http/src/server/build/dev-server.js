const devServer = require('@neutrinojs/dev-server');

module.exports = (flecks) => (neutrino) => {
  const {
    devHost,
    devPort,
    devPublic,
    devStats,
    port,
  } = flecks.get('@flecks/http/server');
  neutrino.use(devServer({
    hot: false,
    host: devHost,
    port: devPort || (port + 1),
    public: devPublic,
    stats: devStats,
  }));
};
