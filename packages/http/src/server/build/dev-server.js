const env = require('../environment');

module.exports = () => (neutrino) => {
  if ('production' === neutrino.config.get('mode')) {
    return;
  }
  const {devHost, devPort, devPublic} = env();
  neutrino.config.devServer
    .hot(false)
    .host(devHost)
    .port(devPort)
    .public(devPublic)
    .stats('minimal');
};
