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
          from: '.',
          to: '.',
          globOptions: {
            dot: true,
            ignore: [
              'dist',
              'node_modules',
            ],
            gitignore: true,
          },
        },
      ],
      pluginId: '@flecks/core/copy',
    }),
    autoentry(),
    fleck(),
  ],
};
