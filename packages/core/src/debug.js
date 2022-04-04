const D = require('debug');

const {
  VSCODE_INSPECTOR_OPTIONS,
} = process.env;

let hasInitialized;
module.exports = (name) => {
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
    const type = 'server' === process.env.FLECKS_CORE_BUILD_TARGET ? 'error' : 'debug';
    // eslint-disable-next-line no-console
    D.log = console[type].bind(console);
  }
  return D(name);
};
