/* eslint-disable no-param-reassign */
const {dirname, join} = require('path');
const {realpath} = require('fs/promises');

const {require: R} = require('@flecks/core/server');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

module.exports = async (flecks) => {
  const root = await realpath(dirname(R.resolve(join(flecks.resolve('@flecks/http'), 'entry.js'))));
  return (neutrino) => {
    const {options} = neutrino;
    const {output: originalOutput} = options;
    neutrino.config.resolve.modules.merge([
      join(FLECKS_CORE_ROOT, 'node_modules'),
      'node_modules',
    ]);
    options.root = root;
    options.source = '.';
    options.mains.index = 'entry';
    options.mains.tests = {
      entry: './client/tests',
      title: 'Testbed',
    };
    options.output = join(originalOutput, flecks.get('@flecks/http/server.output'));
  };
};
