const {readFile} = require('fs/promises');
const {join} = require('path');

const D = require('@flecks/core/build/debug');

const debug = D('@flecks/build/build/load-config');

module.exports = async function loadConfig(root) {
  try {
    const {load} = require('js-yaml');
    const filename = join(root, 'build', 'flecks.yml');
    const buffer = await readFile(filename, 'utf8');
    debug('parsing configuration from YML...');
    return ['YML', load(buffer, {filename})];
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
