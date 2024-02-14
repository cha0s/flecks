exports.hook = () => [
  /**
   * Babel configuration. See: https://babeljs.io/docs/en/config-files
   */
  'babel.config.js',
  /**
   * ESLint defaults. The generated `eslint.config.js` just reads from this file so that the
   * build can dynamically configure parts of ESLint.
   */
  'default.eslint.config.js',
  /**
   * ESLint configuration managed by flecks to allow async.
   */
  'eslint.config.js',
  /**
   * Flecks webpack configuration. See: https://webpack.js.org/configuration/
   */
  'fleckspack.config.js',
  /**
   * Fleck source build configuration. See: https://webpack.js.org/configuration/
   */
  'fleck.webpack.config.js',
  /**
   * Fleck test build configuration. See: https://webpack.js.org/configuration/
   */
  'test.webpack.config.js',
];
