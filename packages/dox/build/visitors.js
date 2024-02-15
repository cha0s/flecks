const {
  isArrayExpression,
  isArrowFunctionExpression,
  isIdentifier,
  isLiteral,
  isMemberExpression,
  isObjectExpression,
  isStringLiteral,
  isThisExpression,
  isVariableDeclaration,
  isBlockStatement,
  isReturnStatement,
  isFunction,
  isCallExpression,
} = require('@babel/types');
const {Flecks} = require('@flecks/core/build/flecks');
const {parse: parseComment} = require('comment-parser');

function visitProperties(properties, fn) {
  properties.forEach((property) => {
    const {key} = property;
    if (isLiteral(key)) {
      fn(property);
    }
  });
}

// Test Flecks.hooks(require.context(...))
function testRight(right, fn) {
  if (isCallExpression(right)) {
    if (isMemberExpression(right.callee)) {
      if (
        isIdentifier(right.callee.object) && 'Flecks' === right.callee.object.name
        && isIdentifier(right.callee.property) && 'hooks' === right.callee.property.name
      ) {
        if (isCallExpression(right.arguments[0])) {
          if (
            isIdentifier(right.arguments[0].callee.object)
            && 'require' === right.arguments[0].callee.object.name
            && isIdentifier(right.arguments[0].callee.property)
            && 'context' === right.arguments[0].callee.property.name
          ) {
            fn(right.arguments[0].arguments);
          }
        }
      }
    }
  }
}

exports.hookBaseVisitor = (fn) => ({
  // exports.hooks = Flecks.hooks(require.context(...))
  AssignmentExpression(path) {
    const {left, right} = path.node;
    if (isMemberExpression(left)) {
      if (isIdentifier(left.object) && 'exports' === left.object.name) {
        if (isIdentifier(left.property) && 'hooks' === left.property.name) {
          testRight(right, fn);
        }
      }
    }
  },
  // export const hooks = Flecks.hooks(require.context(...))
  ExportNamedDeclaration(path) {
    const {declaration} = path.node;
    if (isVariableDeclaration(declaration)) {
      const {declarations} = declaration;
      declarations.forEach((declarator) => {
        if ('hooks' === declarator.id.name) {
          testRight(declarator.init, fn);
        }
      });
    }
  },
});

exports.hookImplementationVisitor = (fn) => ({
  // exports.hooks = {...}
  AssignmentExpression(path) {
    const {left, right} = path.node;
    if (isMemberExpression(left)) {
      if (isIdentifier(left.object) && 'exports' === left.object.name) {
        if (isIdentifier(left.property) && 'hooks' === left.property.name) {
          if (isObjectExpression(right)) {
            visitProperties(right.properties, fn);
          }
        }
      }
    }
  },
  // export const hooks = {...}
  ExportNamedDeclaration(path) {
    const {declaration} = path.node;
    if (isVariableDeclaration(declaration)) {
      const {declarations} = declaration;
      declarations.forEach((declarator) => {
        if ('hooks' === declarator.id.name) {
          if (isObjectExpression(declarator.init)) {
            visitProperties(declarator.init.properties, fn);
          }
        }
      });
    }
  },
});

exports.hookVisitor = (hook) => (fn) => (
  exports.hookImplementationVisitor((property) => (
    hook === property.key.value ? fn(property) : undefined
  ))
);

function functionResultVisitor(value, fn) {
  if (isArrowFunctionExpression(value)) {
    fn(value.body);
  }
  if (isFunction(value)) {
    if (isBlockStatement(value.body)) {
      for (let i = 0; i < value.body.body.length; ++i) {
        if (isReturnStatement(value.body.body[i])) {
          fn(value.body.body[i].argument);
        }
      }
    }
  }
}

exports.buildFileVisitorRaw = (node, fn) => {
  if (isArrayExpression(node)) {
    node.elements
      .map((element) => {
        let filename;
        if (isStringLiteral(element)) {
          filename = element.value;
        }
        if (!filename) {
          return undefined;
        }
        return {
          filename,
          description: (
            (element.leadingComments?.length > 0)
              ? element.leadingComments.pop().value.split('\n')
                .map((line) => line.trim())
                .map((line) => line.replace(/^\*/, ''))
                .map((line) => line.trim())
                .join('\n')
                .trim()
              : undefined
          ),
        };
      })
      .filter((buildFile) => buildFile)
      .forEach(fn);
  }
};

exports.buildFileVisitor = (fn) => exports.hookVisitor('@flecks/build.files')(
  (property) => {
    functionResultVisitor(property.value, (node) => {
      exports.buildFileVisitorRaw(node, fn);
    });
  },
);

exports.configVisitorRaw = (node, fn) => {
  if (isObjectExpression(node)) {
    node.properties.forEach((property) => {
      if (isIdentifier(property.key) || isStringLiteral(property.key)) {
        fn({
          key: property.key.name || property.key.value,
          description: (property.leadingComments?.length > 0)
            ? property.leadingComments.pop().value.split('\n')
              .map((line) => line.trim())
              .map((line) => line.replace(/^\*/, ''))
              .map((line) => line.trim())
              .filter((line) => !!line)
              .join(' ')
              .trim()
            : undefined,
          location: property.value.loc,
        });
      }
    });
  }
};

exports.configVisitor = (fn) => exports.hookVisitor('@flecks/core.config')(
  (property) => {
    functionResultVisitor(property.value, (node) => {
      exports.configVisitorRaw(node, fn);
    });
  },
);

exports.hookInvocationVisitor = (fn) => ({
  CallExpression(path) {
    if (isMemberExpression(path.node.callee)) {
      if (
        (
          isIdentifier(path.node.callee.object)
          && 'flecks' === path.node.callee.object.name
        )
        || (
          isIdentifier(path.node.callee.object.property)
          && 'flecks' === path.node.callee.object.property.name
        )
        || isThisExpression(path.node.callee.object)
      ) {
        if (isIdentifier(path.node.callee.property)) {
          const invocation = {
            isThis: isThisExpression(path.node.callee.object),
            location: path.node.loc,
          };
          if (path.node.callee.property.name.match(/^invoke.*/)) {
            if (path.node.arguments.length > 0) {
              if (isStringLiteral(path.node.arguments[0])) {
                fn({
                  ...invocation,
                  hook: path.node.arguments[0].value,
                  type: path.node.callee.property.name,
                });
              }
            }
          }
          if ('makeMiddleware' === path.node.callee.property.name) {
            if (path.node.arguments.length > 0) {
              if (isStringLiteral(path.node.arguments[0])) {
                fn({
                  ...invocation,
                  hook: path.node.arguments[0].value,
                  type: 'invokeFleck',
                });
              }
            }
          }
          if ('gather' === path.node.callee.property.name) {
            if (path.node.arguments.length > 0) {
              if (isStringLiteral(path.node.arguments[0])) {
                fn({
                  ...invocation,
                  hook: path.node.arguments[0].value,
                  type: 'invokeMerge',
                });
                fn({
                  ...invocation,
                  hook: `${path.node.arguments[0].value}.decorate`,
                  type: 'invokeComposed',
                });
              }
            }
          }
        }
      }
    }
  },
});

exports.hookSpecificationVisitor = (fn) => (
  exports.hookImplementationVisitor((property) => {
    if (property.leadingComments) {
      const {key, value: example} = property;
      const [{value}] = property.leadingComments;
      const [{description, tags}] = parseComment(`/**\n${value}\n*/`, {spacing: 'preserve'});
      const [invoke] = tags
        .filter(({tag}) => 'invoke' === tag)
        .map(({name}) => (name ? `invoke${name}` : 'invoke'));
      const [returns] = tags
        .filter(({tag}) => 'returns' === tag)
        .map(({description, name, type}) => ({description: `${name} ${description}`.trim(), type}));
      fn({
        hook: key.value,
        description: description.trim(),
        location: example.loc,
        params: tags
          .filter(({tag}) => 'param' === tag)
          .map(({description, name, type}) => ({description, name, type})),
        ...returns && {returns},
        ...invoke && {invoke},
      });
    }
  })
);

exports.todoVisitor = (fn) => ({
  enter(path) {
    if (path.node.leadingComments) {
      path.node.leadingComments.forEach((comment, i) => {
        if (comment.value.toLowerCase().match('@todo')) {
          fn({
            description: path.node.leadingComments
              .slice(i)
              .map(({value}) => {
                const index = value.indexOf('@todo');
                return -1 === index ? value : value.slice(index + 6);
              })
              .join(''),
            location: path.node.loc,
          });
        }
      });
    }
  },
});

exports.hookExportVisitor = (fn) => ({
  AssignmentExpression(path) {
    const {left, right} = path.node;
    if (isMemberExpression(left)) {
      if (isIdentifier(left.object) && 'exports' === left.object.name) {
        if (isIdentifier(left.property) && 'hook' === left.property.name) {
          if (isFunction(right)) {
            functionResultVisitor(right, fn);
          }
        }
      }
    }
  },
  ExportNamedDeclaration(path) {
    if (isVariableDeclaration(path.node.declaration)) {
      if ('hook' === Flecks.get(path, 'node.declaration.declarations[0].id.name')) {
        if (isFunction(path.node.declaration.declarations[0].id.init)) {
          functionResultVisitor(path.node.declaration.declarations[0].id.init, fn);
        }
      }
    }
    if (isFunction(path.node.declaration)) {
      functionResultVisitor(path.node.declaration, fn);
    }
  },
});
