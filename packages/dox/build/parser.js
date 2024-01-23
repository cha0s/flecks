const {readFile} = require('fs/promises');
const {join, relative} = require('path');

const {transformAsync} = require('@babel/core');
const {default: traverse} = require('@babel/traverse');
const {glob} = require('@flecks/core/server');

const {
  buildFileVisitor,
  configVisitor,
  hookImplementationVisitor,
  hookInvocationVisitor,
  hookSpecificationVisitor,
  todoVisitor,
} = require('./visitors');

exports.parseCode = async (code) => {
  const {ast} = await transformAsync(code, {ast: true, code: false});
  return ast;
};

exports.parseNormalSource = async (path, source) => {
  const ast = await exports.parseCode(source);
  const buildFiles = [];
  const configs = [];
  const hookImplementations = [];
  const hookInvocations = [];
  const todos = [];
  const pushOne = (array) => (element) => {
    array.push(element);
  };
  traverse(ast, buildFileVisitor(pushOne(buildFiles)));
  traverse(ast, configVisitor((config) => {
    const {description, key, location: {start: {index: start}, end: {index: end}}} = config;
    configs.push({
      defaultValue: source.slice(start, end),
      description,
      key,
    });
  }));
  traverse(ast, hookImplementationVisitor((hookImplementation) => {
    const {key: {value: hook}, loc: {start: {column, line}}} = hookImplementation;
    hookImplementations.push({
      column,
      hook,
      line,
    });
  }));
  traverse(ast, hookInvocationVisitor((hookInvocation) => {
    const isClassFile = [
      '@flecks/core/build/flecks.js',
      '@flecks/build/build/build.js',
    ]
      .includes(path);
    if (!isClassFile && hookInvocation.isThis) {
      return;
    }
    const {location: {start: {column, line}}, hook, type} = hookInvocation;
    hookInvocations.push({
      column,
      hook,
      line,
      type,
    });
  }));
  traverse(ast, todoVisitor((todo) => {
    const {description, location: {start: {index: start}, end: {index: end}}} = todo;
    todos.push({
      context: source.slice(start, end),
      description,
    });
  }));
  return {
    buildFiles,
    config: configs,
    hookImplementations,
    hookInvocations,
    todos,
  };
};

exports.parseHookSpecificationSource = async (path, source) => {
  const ast = await exports.parseCode(source);
  const hookSpecifications = [];
  traverse(ast, hookSpecificationVisitor((hookSpecification) => {
    const {
      description,
      hook,
      location: {start: {index: start}, end: {index: end}},
      params,
    } = hookSpecification;
    hookSpecifications.push({
      description,
      example: source.slice(start, end),
      hook,
      params,
    });
  }));
  return {
    hookSpecifications,
  };
};

exports.parseSource = async (path, source) => {
  if (path.match(/build\/flecks\.hooks\.js$/)) {
    return exports.parseHookSpecificationSource(path, source);
  }
  return exports.parseNormalSource(path, source);
};

exports.parseFleckRoot = async (path, root) => (
  Promise.all(
    (await Promise.all([
      ...await glob(join(root, 'src', '**', '*.js')),
      ...await glob(join(root, 'build', '**', '*.js')),
    ]))
      .map((filename) => [relative(root, filename), filename])
      .map(async ([path, filename]) => {
        const buffer = await readFile(filename);
        return [path, await exports.parseSource(path, buffer.toString('utf8'))];
      }),
  )
);

exports.parseFlecks = async (flecks) => (
  Promise.all(
    Object.entries(flecks.roots)
      .map(async ([path, {root}]) => [path, await exports.parseFleckRoot(path, root)]),
  )
);
