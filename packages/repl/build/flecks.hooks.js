export const hooks = {
  /**
   * Define REPL commands.
   *
   * Note: commands will be prefixed with a period in the Node REPL.
   * @invoke MergeUniqueAsync
   */
  '@flecks/repl.commands': () => ({
    someCommand: (...args) => {
      // args are passed from the Node REPL. So, you could invoke it like:
      // .someCommand foo bar
      // and `args` would be `['foo', 'bar']`.
    },
  }),
  /**
   * Provide global context to the REPL.
   * @invoke MergeUniqueAsync
   */
  '@flecks/repl.context': () => {
    // Now you'd be able to do like:
    // `node> someValue;`
    // and the REPL would evaluate it to `'foobar'`.
    return {
      someValue: 'foobar',
    };
  },
};

