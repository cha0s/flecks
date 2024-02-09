const {readFile} = require('fs/promises');
const {join} = require('path');

const {loadYml} = require('@flecks/core/src/server');

const D = require('@flecks/core/build/debug');

const debug = D('@flecks/build/build/load-config');

module.exports = async function loadConfig(root) {
  try {
    const filename = join(root, 'build', 'flecks.yml');
    const buffer = await readFile(filename, 'utf8');
    debug('parsing configuration from YML...');
    return ['YML', loadYml(buffer, {filename})];
  }
  catch (error) {
    if ('ENOENT' !== error.code) {
      throw error;
    }
    const {name} = require(join(root, 'package.json'));
    const barebones = {
      '@flecks/build': {},
      '@flecks/core': {},
      '@flecks/fleck': {},
    };
    if (barebones[name]) {
      delete barebones[name];
    }
    barebones[`${name}:${root}`] = {};
    return ['barebones', barebones];
  }
};
