const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineChunkHtmlPlugin = require('react-dev-utils/InlineChunkHtmlPlugin');

module.exports = () => ({config}) => {
  const isProduction = 'production' === config.get('mode');
  // Emit node buffer builtin.
  config.node
    .set('Buffer', true);
  // Source maps.
  config.module
    .rule('maps')
    .test(/\.js$/)
    .enforce('pre')
    .use('source-map-loader')
    .loader('source-map-loader');
  config.devtool(isProduction ? 'source-map' : 'eval-source-map');
  // Asset naming.
  config.output
    .chunkFilename(isProduction ? 'assets/[name].[contenthash:8].js' : 'assets/[name].js');
  config
    .plugin('inline-chunks')
    .use(InlineChunkHtmlPlugin, [HtmlWebpackPlugin, [/index.*\.js$/]]);
};
