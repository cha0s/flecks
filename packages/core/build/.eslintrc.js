const neutrino = require('neutrino');

// eslint-disable-next-line import/no-dynamic-require
module.exports = neutrino(require(`${__dirname}/.neutrinorc`)).eslintrc();
