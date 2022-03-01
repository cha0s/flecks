import D from 'debug';

const {
  VSCODE_INSPECTOR_OPTIONS,
} = process.env;

let hasInitialized;
export default (name) => {
  if (!hasInitialized) {
    // VSCode has a problem showing colors when formatting objects.
    if (VSCODE_INSPECTOR_OPTIONS) {
      const {formatArgs} = D;
      D.formatArgs = function formatObjectsWithoutColor(args) {
        const {useColors} = this;
        if (args[0].match(/%[oO]/)) {
          this.useColors = false;
        }
        formatArgs.call(this, args);
        this.useColors = useColors;
      };
      D.formatters.o = undefined;
      D.formatters.O = undefined;
    }
    // eslint-disable-next-line no-console
    D.log = console.debug.bind(console);
  }
  return D(name);
};