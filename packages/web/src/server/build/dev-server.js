const devServer = require('@neutrinojs/dev-server');

module.exports = (flecks) => (neutrino) => {
  const {
    devHost,
    devPort,
    devPublic,
    devStats,
    port,
  } = flecks.get('@flecks/web/server');
  neutrino.use(devServer({
    historyApiFallback: {
      disableDotRule: true,
    },
    hot: false,
    host: devHost,
    port: devPort || (port + 1),
    public: devPublic,
    stats: {
      ...devStats,
      warningsFilter: [
        /Failed to parse source map/,
      ],
    },
  }));
};
