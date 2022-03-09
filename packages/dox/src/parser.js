import {readFile} from 'fs/promises';
import {dirname, join} from 'path';

import {transformAsync} from '@babel/core';
import traverse from '@babel/traverse';
import {
  isArrayExpression,
  isArrowFunctionExpression,
  isIdentifier,
  isLiteral,
  isMemberExpression,
  isObjectExpression,
  isStringLiteral,
  isThisExpression,
} from '@babel/types';
import {require as R} from '@flecks/core/server';
import {parse as parseComment} from 'comment-parser';
import glob from 'glob';

const flecksCorePath = dirname(__non_webpack_require__.resolve('@flecks/core/package.json'));

class ParserState {

  constructor() {
    this.buildConfigs = [];
    this.hooks = {};
    this.todos = [];
  }

  addBuildConfig(config, comment) {
    this.buildConfigs.push({comment, config});
  }

  addImplementation(hook, filename, loc) {
    this.hooks[hook] = this.hooks[hook] || {};
    this.hooks[hook].implementations = this.hooks[hook].implementations || [];
    this.hooks[hook].implementations.push({filename, loc});
  }

  addInvocation(hook, type, filename, loc) {
    this.hooks[hook] = this.hooks[hook] || {};
    this.hooks[hook].invocations = this.hooks[hook].invocations || [];
    this.hooks[hook].invocations.push({filename, loc, type});
  }

  addSpecification(hook, specification) {
    this.hooks[hook] = this.hooks[hook] || {};
    this.hooks[hook].specification = specification;
  }

  addTodo(comment, filename) {
    this.todos.push({filename, loc: comment.loc, text: comment.value.trim()});
  }

}

const implementationVisitor = (fn) => ({
  ExportDefaultDeclaration(path) {
    const {declaration} = path.node;
    if (isObjectExpression(declaration)) {
      const {properties} = declaration;
      properties.forEach((property) => {
        const {key, value} = property;
        if (isIdentifier(key) && key.name === 'Hooks') {
          if (isObjectExpression(value)) {
            const {properties} = value;
            properties.forEach((property) => {
              const {key} = property;
              if (isLiteral(key)) {
                fn(property);
              }
            });
          }
        }
      });
    }
  },
});

const FlecksBuildConfigs = (state) => (
  implementationVisitor((property) => {
    if ('@flecks/core.build.config' === property.key.value) {
      if (isArrowFunctionExpression(property.value)) {
        if (isArrayExpression(property.value.body)) {
          property.value.body.elements.forEach((element) => {
            let config;
            if (isStringLiteral(element)) {
              config = element.value;
            }
            if (isArrayExpression(element)) {
              if (element.elements.length > 0 && isStringLiteral(element.elements[0])) {
                config = element.elements[0].value;
              }
            }
            if (config && element.leadingComments.length > 0) {
              state.addBuildConfig(
                config,
                element.leadingComments.pop().value.split('\n')
                  .map((line) => line.trim())
                  .map((line) => line.replace(/^\*/, ''))
                  .map((line) => line.trim())
                  .filter((line) => !!line)
                  .join(' ')
                  .trim(),
              );
            }
          });
        }
      }
    }
  })
);

const FlecksInvocations = (state, filename) => ({
  CallExpression(path) {
    if (isMemberExpression(path.node.callee)) {
      if (
        (isIdentifier(path.node.callee.object) && 'flecks' === path.node.callee.object.name)
        || (
          (
            isThisExpression(path.node.callee.object)
            && (filename === join(flecksCorePath, 'src', 'flecks.js'))
          )
        )
      ) {
        if (isIdentifier(path.node.callee.property)) {
          if (path.node.callee.property.name.match(/^invoke.*/)) {
            if (path.node.arguments.length > 0) {
              if (isStringLiteral(path.node.arguments[0])) {
                state.addInvocation(
                  path.node.arguments[0].value,
                  path.node.callee.property.name,
                  filename,
                  path.node.loc,
                );
              }
            }
          }
          if ('up' === path.node.callee.property.name) {
            if (path.node.arguments.length > 0) {
              if (isStringLiteral(path.node.arguments[0])) {
                state.addInvocation(
                  path.node.arguments[0].value,
                  'invokeSequentialAsync',
                  filename,
                  path.node.loc,
                );
                state.addInvocation(
                  '@flecks/core.starting',
                  'invokeFlat',
                  filename,
                  path.node.loc,
                );
              }
            }
          }
          if ('gather' === path.node.callee.property.name) {
            if (path.node.arguments.length > 0) {
              if (isStringLiteral(path.node.arguments[0])) {
                state.addInvocation(
                  path.node.arguments[0].value,
                  'invokeMerge',
                  filename,
                  path.node.loc,
                );
                state.addInvocation(
                  `${path.node.arguments[0].value}.decorate`,
                  'invokeComposed',
                  filename,
                  path.node.loc,
                );
              }
            }
          }
        }
      }
    }
  },
});

const FlecksImplementations = (state, filename) => (
  implementationVisitor(({key}) => {
    state.addImplementation(
      key.value,
      filename,
      key.loc,
    );
  })
);

const FlecksSpecifications = (state, source) => (
  implementationVisitor((property) => {
    if (property.leadingComments) {
      const {key, value: example} = property;
      const [{value}] = property.leadingComments;
      const [{description, tags}] = parseComment(`/**\n${value}\n*/`, {spacing: 'preserve'});
      const params = tags
        .filter(({tag}) => 'param' === tag)
        .map(({description, name, type}) => ({description, name, type}));
      state.addSpecification(
        key.value,
        {
          description,
          example: source.slice(example.start, example.end),
          params,
        },
      );
    }
  })
);

const FlecksTodos = (state, filename) => ({
  enter(path) {
    if (path.node.leadingComments) {
      path.node.leadingComments.forEach((comment) => {
        if (comment.value.toLowerCase().match('@todo')) {
          state.addTodo(comment, filename);
        }
      });
    }
  },
});

export const parseCode = async (code) => {
  const config = {
    ast: true,
    code: false,
  };
  const {ast} = await transformAsync(code, config);
  return ast;
};

export const parseFile = async (filename, resolved, state) => {
  const buffer = await readFile(filename);
  const ast = await parseCode(buffer.toString('utf8'));
  traverse(ast, FlecksBuildConfigs(state, resolved));
  traverse(ast, FlecksInvocations(state, resolved));
  traverse(ast, FlecksImplementations(state, resolved));
  traverse(ast, FlecksTodos(state, resolved));
};

const fleckSources = async (path) => (
  new Promise((r, e) => (
    glob(
      join(path, 'src', '**', '*.js'),
      (error, result) => (error ? e(error) : r(result)),
    )
  ))
);

export const parseFleckRoot = async (root, state) => {
  const resolved = dirname(R.resolve(join(root, 'package.json')));
  const sources = await fleckSources(resolved);
  await Promise.all(
    sources.map(async (source) => {
      // @todo Aliased fleck paths are gonna be bad.
      await parseFile(source, join(root, source.slice(resolved.length)), state);
    }),
  );
  try {
    const buffer = await readFile(join(resolved, 'build', 'dox', 'hooks.js'));
    const source = buffer.toString('utf8');
    const ast = await parseCode(source);
    traverse(ast, FlecksSpecifications(state, source));
  }
  catch (error) {
    if ('ENOENT' !== error.code) {
      throw error;
    }
  }
};

export const parseFlecks = async (flecks) => {
  const state = new ParserState();
  const paths = Object.keys(flecks.resolver);
  const roots = Array.from(new Set(
    paths
      .map((path) => flecks.root(path))
      .filter((e) => !!e),
  ));
  await Promise.all(
    roots
      .map(async (root) => {
        await parseFleckRoot(root, state);
      }),
  );
  return state;
};
