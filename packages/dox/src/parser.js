import {readFile} from 'fs/promises';
import {dirname, join} from 'path';

import {transformAsync} from '@babel/core';
import traverse from '@babel/traverse';
import {
  isIdentifier,
  isMemberExpression,
  isStringLiteral,
  isThisExpression,
} from '@babel/types';
import glob from 'glob';

const flecksCorePath = dirname(__non_webpack_require__.resolve('@flecks/core/package.json'));

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
                state.invocations.push({
                  filename,
                  hook: path.node.arguments[0].value,
                  line: path.node.loc.start.line,
                  type: path.node.callee.property.name,
                });
              }
            }
          }
          if ('up' === path.node.callee.property.name) {
            if (path.node.arguments.length > 0) {
              if (isStringLiteral(path.node.arguments[0])) {
                state.invocations.push({
                  filename,
                  hook: path.node.arguments[0].value,
                  line: path.node.loc.start.line,
                  type: 'invokeSequentialAsync',
                });
                state.invocations.push({
                  filename,
                  hook: '@flecks/core/starting',
                  line: path.node.loc.start.line,
                  type: 'invokeFlat',
                });
              }
            }
          }
          if ('gather' === path.node.callee.property.name) {
            if (path.node.arguments.length > 0) {
              if (isStringLiteral(path.node.arguments[0])) {
                state.invocations.push({
                  filename,
                  hook: path.node.arguments[0].value,
                  line: path.node.loc.start.line,
                  type: 'invokeReduce',
                });
                state.invocations.push({
                  filename,
                  hook: `${path.node.arguments[0].value}.decorate`,
                  line: path.node.loc.start.line,
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

export const parseCode = async (code, state, filename = '<inline>') => {
  const config = {
    ast: true,
    code: false,
    configFile: join(__dirname, '..', '..', 'core', 'src', 'build', 'babel.config.js'),
  };
  const {ast} = await transformAsync(code, config);
  traverse(ast, FlecksInvocations(state, filename));
};

export const parseFile = async (filename, state) => {
  const buffer = await readFile(filename);
  return parseCode(buffer.toString('utf8'), state, filename);
};

const fleckSources = (path) => (
  new Promise((r, e) => (
    glob(
      join(path, 'src', '**', '*.js'),
      (error, result) => (error ? e(error) : r(result)),
    )
  ))
);

export const parseFleck = async (path, state) => {
  const sources = await fleckSources(path);
  await Promise.all(sources.map((source) => parseFile(source, state)));
};

const state = {
  invocations: [],
};
(async () => {
  const path = flecksCorePath;
  await parseFleck(path, state);
  state.invocations.forEach(({
    filename,
    hook,
    line,
    type,
  }) => {
    console.log(`${type}('${hook}') in ${filename}:${line}`);
  });
})();
