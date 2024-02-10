/* eslint-disable global-require */

const {dump: dumpYml, load: loadYml} = require('js-yaml');

module.exports = {
  dumpYml,
  glob: require('glob').glob,
  loadYml,
  ...require('../../build/stream'),
  ...require('./fs'),
  ...require('./package-manager'),
  ...require('./process'),
};
