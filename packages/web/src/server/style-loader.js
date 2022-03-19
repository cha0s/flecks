const parser = require('@babel/parser');
const types = require('@babel/types');

// On the server we use `lazyStyleTag` to avoid either dying over the lack of `document` or the
// inefficiency of extracting styles needlessly. When importing CSS modules, `lazyStyleTag` moves
// the default export into a named `locals` export. This babel plugin injects a small amount of
// code after the import in order to hide that from client code.
module.exports = () => ({
  visitor: {
    ImportDeclaration(path) {
      if (path.node.source.value.match(/\.module\.(c|s[ac])ss$/)) {
        const defaultSpecifier = path.node.specifiers.find(types.isImportDefaultSpecifier);
        const {name} = defaultSpecifier.local;
        defaultSpecifier.local.name = `${name}__default`;
        path.insertAfter(parser.parse(`const ${name} = ${name}__default?.locals || ${name}__default`));
      }
    },
  },
});
