const {readFile} = require('fs/promises');
const {dirname, join, relative} = require('path');

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

exports.parseCode = async (code, options = {}) => {
  const {ast} = await transformAsync(code, {ast: true, code: false, ...options});
  return ast;
};

exports.parseNormalSource = async (path, source, root, options) => {
  const ast = await exports.parseCode(source, options);
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
      .includes(join(root, path));
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

exports.parseHookSpecificationSource = async (path, source, options) => {
  const ast = await exports.parseCode(source, options);
  const hookSpecifications = [];
  traverse(ast, hookSpecificationVisitor((hookSpecification) => {
    const {
      location: {start: {index: start}, end: {index: end}},
      ...specification
    } = hookSpecification;
    hookSpecifications.push({...specification, example: source.slice(start, end)});
  }));
  return {
    hookSpecifications,
  };
};

exports.parseSource = async (path, source, root, options) => {
  if (path.match(/build\/flecks\.hooks\.js$/)) {
    return exports.parseHookSpecificationSource(path, source, options);
  }
  return exports.parseNormalSource(path, source, root, options);
};

exports.parseFleckRoot = async (root, request, options) => (
  Promise.all(
    (await Promise.all([
      ...await glob(join(request, 'src', '**', '*.{js,jsx}')),
      ...await glob(join(request, 'build', '**', '*.{js,jsx}')),
    ]))
      .map((filename) => [relative(request, filename), filename])
      .map(async ([path, filename]) => {
        const buffer = await readFile(filename);
        return [path, await exports.parseSource(path, buffer.toString('utf8'), root, options)];
      }),
  )
);

exports.parseFlecks = async (flecks) => {
  const babel = await flecks.babel();
  return Promise.all(
    flecks.roots
      .map(async ([path, request]) => [
        path,
        await exports.parseFleckRoot(
          path,
          dirname(await flecks.resolver.resolve(join(request, 'package.json'))),
          babel,
        ),
      ]),
  );
};
