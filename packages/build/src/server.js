/* eslint-disable global-require */

const {dump: dumpYml, load: loadYml} = require('js-yaml');

module.exports = {
  dumpYml,
  loadYml,
  webpack: require('webpack'),
  ...require('../build/webpack'),
};
