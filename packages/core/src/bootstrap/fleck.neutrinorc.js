const copy = require('@neutrinojs/copy');

const autoentry = require('./autoentry');
const fleck = require('./fleck');

const {
  FLECKS_ROOT = process.cwd(),
} = process.env;

module.exports = {
  options: {
    output: 'dist',
    root: FLECKS_ROOT,
  },
  use: [
    copy({
      patterns: [
        {
          from: 'package.json',
          to: '.',
        },
        {
          from: 'build',
          to: 'build',
        },
        {
          from: 'src',
          to: 'src',
        },
      ],
      pluginId: '@flecks/core/copy',
    }),
    autoentry(),
    fleck(),
  ],
};
