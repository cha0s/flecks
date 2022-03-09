const neutrino = require('neutrino');

const R = require('../../bootstrap/require');
const D = require('../../debug');
const {targetNeutrino} = require('../commands');
const {default: Flecks} = require('../flecks');

const debug = D('@flecks/core/.eslintrc.js');

const {
  FLECKS_CORE_BUILD_TARGET = 'fleck',
} = process.env;

debug('bootstrapping flecks...');
const flecks = Flecks.bootstrap();
debug('bootstrapped');

const config = R(process.env[targetNeutrino(FLECKS_CORE_BUILD_TARGET)]);
flecks.invokeFlat('@flecks/core.build', FLECKS_CORE_BUILD_TARGET, config);
module.exports = neutrino(config).eslintrc();
