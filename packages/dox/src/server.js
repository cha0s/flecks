import commands from './commands';

export const hooks = {
  '@flecks/core.commands': commands,
  '@flecks/core.config': () => ({
    /**
     * Rewrite the output filenames of source files.
     *
     * `filename.replace(new RegExp([key]), [value]);`
     */
    filenameRewriters: {},
  }),
};
