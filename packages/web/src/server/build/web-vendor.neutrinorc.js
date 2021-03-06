const {join} = require('path');

const {require: R} = require('@flecks/core/server');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

module.exports = async (flecks) => {
  const config = {
    options: {
      output: join(
        FLECKS_CORE_ROOT,
        'node_modules',
        '.cache',
        'flecks',
      ),
      root: FLECKS_CORE_ROOT,
    },
    use: [
      ({config, options}) => {
        const dll = flecks.get('@flecks/web/server.dll');
        if (dll.length > 0) {
          // Build the library and manifest.
          config.context(options.root);
          const entries = config.entry('index').clear();
          dll.forEach((module) => {
            entries.add(module);
          });
          config
            .plugin('dll')
            .use(
              R.resolve('webpack/lib/DllPlugin'),
              [
                {
                  context: options.root,
                  path: join(options.output, 'web-vendor.manifest.json'),
                  name: 'flecks_web_vendor',
                },
              ],
            );
          // Output.
          config
            .devtool('cheap-module-source-map');
          config.output
            .path(options.output)
            .library('flecks_web_vendor')
            .filename('web-vendor.js');
          config.node
            .set('fs', 'empty');
          // Resolution.
          config.resolve.extensions
            .merge([
              '.wasm',
              ...options.extensions.map((ext) => `.${ext}`),
              '.json',
            ]);
          config.module
            .rule('mjs')
            .test(/\.mjs$/)
            .include
            .add(/node_modules/)
            .end()
            .type('javascript/auto');
          config.resolve.modules
            .merge([join(FLECKS_CORE_ROOT, 'node_modules')]);
          // Reporting.
          config.stats({
            ...flecks.get('@flecks/web/server.stats'),
            warningsFilter: [
              /Failed to parse source map/,
            ],
          });
        }
      },
    ],
  };
  return config;
};
