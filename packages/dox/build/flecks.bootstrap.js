const commands = require('./commands');

exports.hooks = {
  '@flecks/build.commands': commands,
  '@flecks/core.config': () => ({
    /**
     * Pattern pairs used to rewrite filenames in generated documentation.
     */
    rewriteFilenames: [],
  }),
};
