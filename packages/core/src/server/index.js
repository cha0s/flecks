/* eslint-disable global-require */

module.exports = {
  glob: require('glob').glob,
  ...require('../../build/stream'),
  ...require('./package-manager'),
  ...require('./process'),
};
