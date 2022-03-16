const parser = require('@babel/parser');
const types = require('@babel/types');

let id = 0;

module.exports = () => ({
  visitor: {
    /* eslint-disable no-param-reassign */
    ImportDeclaration(path) {
      if (path.node.source.value.match(/\.(c|s[ac])ss$/)) {
        let defaultSpecifier = path.node.specifiers.find(types.isImportDefaultSpecifier);
        if (!defaultSpecifier) {
          defaultSpecifier = types.importDefaultSpecifier(types.identifier(`FLECKS_STYLES_${id++}`));
          path.node.specifiers.unshift(defaultSpecifier);
        }
        const {name} = defaultSpecifier.local;
        path.insertAfter(parser.parse(`if ('undefined' !== typeof document) ${name}.use();`));
      }
    },
    /* eslint-enable no-param-reassign */
  },
});
