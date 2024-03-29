const {delimiter, join} = require('path');

const D = require('@flecks/core/build/debug');
const {CachedInputFileSystem, ResolverFactory} = require('enhanced-resolve');
const AppendPlugin = require('enhanced-resolve/lib/AppendPlugin');
const AliasPlugin = require('enhanced-resolve/lib/AliasPlugin');
const ModulesInHierarchicalDirectoriesPlugin = require('enhanced-resolve/lib/ModulesInHierarchicalDirectoriesPlugin');
const fs = require('graceful-fs');

const debug = D('@flecks/build/build/resolver');
const debugSilly = debug.extend('silly');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const nodeContext = {
  environments: ['node+es3+es5+process+native'],
};

const nodeFileSystem = new CachedInputFileSystem(fs, 4000);

module.exports = class Resolver {

  constructor(options = {}) {
    const {
      modules = [join(FLECKS_CORE_ROOT, 'node_modules'), 'node_modules'],
      root = FLECKS_CORE_ROOT,
      ...rest
    } = options;
    const {NODE_PATH} = process.env;
    if (NODE_PATH) {
      NODE_PATH.split(delimiter).forEach((path) => {
        if (!modules.includes(path)) {
          modules.push(path);
        }
      });
    }
    this.resolver = ResolverFactory.createResolver({
      conditionNames: ['node'],
      extensions: ['.js', '.json', '.node'],
      fileSystem: nodeFileSystem,
      modules,
      symlinks: false,
      ...rest,
    });
    this.aliases = {};
    this.fallbacks = {};
    this.modules = modules;
    this.root = root;
  }

  addAlias(name, alias) {
    debugSilly("adding alias: '%s' -> '%s'", name, alias);
    this.aliases[name] = alias;
    new AliasPlugin(
      'raw-resolve',
      {name, onlyModule: false, alias},
      'internal-resolve',
    ).apply(this.resolver);
  }

  addExtensions(extensions) {
    debugSilly("adding extensions: '%O'", extensions);
    extensions.forEach((extension) => {
      new AppendPlugin('raw-file', extension, 'file').apply(this);
    });
  }

  addFallback(name, alias) {
    debugSilly("adding fallback: '%s' -> '%s'", name, alias);
    this.fallbacks[name] = alias;
    new AliasPlugin(
      'described-resolve',
      {name, onlyModule: false, alias},
      'internal-resolve',
    ).apply(this.resolver);
  }

  addModules(path) {
    debugSilly("adding modules: '%s'", path);
    this.modules.push(path);
    new ModulesInHierarchicalDirectoriesPlugin(
      'raw-module',
      path,
      'module',
    ).apply(this.resolver);
  }

  static isResolutionError(error) {
    return error.message.startsWith("Can't resolve");
  }

  async resolve(request) {
    try {
      return await new Promise((resolve, reject) => {
        this.resolver.resolve(nodeContext, this.root, request, {}, (error, path) => {
          if (error) {
            reject(error);
          }
          else {
            resolve(path);
          }
        });
      });
    }
    catch (error) {
      if (!this.constructor.isResolutionError(error)) {
        throw error;
      }
      return undefined;
    }
  }

  resolveSync(request) {
    try {
      return this.resolver.resolveSync(nodeContext, this.root, request);
    }
    catch (error) {
      if (!this.constructor.isResolutionError(error)) {
        throw error;
      }
      return undefined;
    }
  }

};
