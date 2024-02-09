/* eslint-disable global-require */

module.exports = {
  rimraf: require('rimraf').rimraf,
  webpack: require('webpack'),
  ...require('../build/webpack'),
};
