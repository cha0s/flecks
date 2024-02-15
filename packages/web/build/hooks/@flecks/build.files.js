exports.hook = () => [
  /**
   * Template file used to generate the client HTML.
   *
   * See: https://github.com/jantimon/html-webpack-plugin/blob/main/docs/template-option.md
   */
  'template.ejs',
  /**
   * PostCSS config file.
   *
   * See: https://github.com/postcss/postcss#usage
   */
  'postcss.config.js',
  /**
   * Web client build configuration. See: https://webpack.js.org/configuration/
   */
  'web.webpack.config.js',
  /**
   * Web vendor DLL build configuration. See: https://webpack.js.org/configuration/
   */
  'web-vendor.webpack.config.js',
];
