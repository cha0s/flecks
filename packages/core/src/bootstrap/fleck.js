const nodeExternals = require('webpack-node-externals');

module.exports = () => (neutrino) => {
  const {name} = neutrino.options.packageJson;
  /* eslint-disable indent */
  neutrino.config
    .devtool('source-map')
    .target('node')
    .optimization
      .splitChunks(false)
      .runtimeChunk(false)
    .end()
    .output
      .filename('[name].js')
      .library(name)
      .libraryTarget('umd')
      .umdNamedDefine(true)
    .end()
    .node
      .set('__dirname', false)
      .set('__filename', false);
  /* eslint-enable indent */
  const options = neutrino.config.module
    .rule('compile')
    .use('babel')
    .get('options');
  options.presets[0][1].targets = {esmodules: true};
  neutrino.config.externals(nodeExternals({importType: 'umd'}));
};
