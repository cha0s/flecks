const copy = require('@neutrinojs/copy');

const autoentry = require('./autoentry');
const fleck = require('./fleck');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

module.exports = {
  options: {
    output: 'dist',
    root: FLECKS_CORE_ROOT,
  },
  use: [
    copy({
      copyUnmodified: true,
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
