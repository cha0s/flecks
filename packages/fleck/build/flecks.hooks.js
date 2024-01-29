export const hooks = {

  /**
   * Process the `package.json` for a built fleck.
   * @param {Object} json The JSON.
   * @param {[Compilation](https://webpack.js.org/api/compilation-object/)} compilation The webpack compilation.
   * @invoke SequentialAsync
   */
  '@flecks/fleck.packageJson': (json, compilation) => {
    json.files.push('something');
  },

};
