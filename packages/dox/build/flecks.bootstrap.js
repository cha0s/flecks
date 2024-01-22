const commands = require('./commands');

exports.hooks = {
  '@flecks/build.commands': commands,
  '@flecks/core.config': () => ({
    /**
     * Rewrite the output filenames of source files.
     *
     * `filename.replace(new RegExp([key]), [value]);`
     */
    filenameRewriters: {},
  }),
};
