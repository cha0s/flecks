/* eslint-disable no-param-reassign */
const {dirname, join} = require('path');
const {realpathSync} = require('fs');

const {require: R} = require('@flecks/core/server');

const {
  FLECKS_HTTP_OUTPUT = 'http',
  FLECKS_ROOT = process.cwd(),
} = process.env;

module.exports = (flecks) => (neutrino) => {
  const {options} = neutrino;
  const {output: originalOutput} = options;
  neutrino.config.resolve.modules.merge([
    join(FLECKS_ROOT, 'node_modules'),
    'node_modules',
  ]);
  options.root = realpathSync(dirname(R.resolve(join(flecks.resolve('@flecks/http'), 'entry.js'))));
  options.source = '.';
  options.mains.index = 'entry';
  options.mains.tests = {
    entry: './client/tests',
    title: 'Testbed',
  };
  options.output = join(originalOutput, FLECKS_HTTP_OUTPUT);
};
