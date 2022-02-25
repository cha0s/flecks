const neutrino = require('neutrino');

const R = require('../bootstrap/require');
const {targetNeutrino} = require('../server/commands');
const {default: Flecks} = require('../server/flecks');

const {
  FLECKS_BUILD_TARGET = 'fleck',
} = process.env;

const flecks = Flecks.bootstrap();

const config = R(process.env[targetNeutrino(FLECKS_BUILD_TARGET)]);
flecks.invokeFlat('@flecks/core/build', FLECKS_BUILD_TARGET, config);
module.exports = neutrino(config).eslintrc();
