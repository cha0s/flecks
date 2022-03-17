const clean = require('@neutrinojs/clean');
const compileLoader = require('@neutrinojs/compile-loader');
const babelMerge = require('babel-merge');
const nodeExternals = require('webpack-node-externals');

const R = require('./require');

module.exports = ({
  babel = {},
  targets = {
    esmodules: true,
    node: 'current',
  },
} = {}) => (neutrino) => {
  const {config, options} = neutrino;
  const {name} = options.packageJson;
  neutrino.use(
    compileLoader({
      include: [options.source, options.tests],
      babel: babelMerge(
        {
          plugins: [R.resolve('@babel/plugin-syntax-dynamic-import')],
          presets: [
            [
              R.resolve('@babel/preset-env'),
              {
                shippedProposals: true,
                targets,
              },
            ],
          ],
        },
        babel,
      ),
    }),
  );
  neutrino.use(clean({cleanStaleWebpackAssets: false}));
  /* eslint-disable indent */
  config
    .context(options.root)
    .devtool('source-map')
    .externals(nodeExternals({importType: 'umd'}))
    .target('node')
    .resolve
      .extensions
        .merge([
          '.wasm',
          ...options.extensions.map((ext) => `.${ext}`),
          '.json',
        ])
      .end()
    .end()
    .stats({
      children: false,
      colors: true,
      entrypoints: false,
      modules: false,
    })
    .optimization
      .splitChunks(false)
      .runtimeChunk(false)
    .end()
    .output
      .filename('[name].js')
      .library(name)
      .libraryTarget('umd')
      .path(options.output)
      .umdNamedDefine(true)
    .end()
    .node
      .set('__dirname', false)
      .set('__filename', false);
  /* eslint-enable indent */
};
