const {readFile} = require('fs/promises');
const {join} = require('path');

const D = require('@flecks/core/build/debug');

const debug = D('@flecks/build/build/load-config');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

module.exports = async function loadConfig() {
  try {
    const {load} = require('js-yaml');
    const filename = join(FLECKS_CORE_ROOT, 'build', 'flecks.yml');
    const buffer = await readFile(filename, 'utf8');
    debug('parsing configuration from YML...');
    return ['YML', load(buffer, {filename})];
  }
  catch (error) {
    if ('ENOENT' !== error.code) {
      throw error;
    }
    const {name} = require(join(FLECKS_CORE_ROOT, 'package.json'));
    const barebones = {
      '@flecks/build': {},
      '@flecks/core': {},
      '@flecks/fleck': {},
    };
    if (barebones[name]) {
      delete barebones[name];
    }
    barebones[`${name}:${FLECKS_CORE_ROOT}`] = {};
    return ['barebones', barebones];
  }
};
