const {join} = require('path');

const D = require('@flecks/core/build/debug');
const {CachedInputFileSystem, ResolverFactory} = require('enhanced-resolve');
const AppendPlugin = require('enhanced-resolve/lib/AppendPlugin');
const AliasPlugin = require('enhanced-resolve/lib/AliasPlugin');
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

  constructor(options) {
    this.resolver = ResolverFactory.createResolver({
      conditionNames: ['node'],
      extensions: ['.js', '.json', '.node'],
      fileSystem: nodeFileSystem,
      symlinks: false,
      ...{
        modules: [join(FLECKS_CORE_ROOT, 'node_modules')],
        ...options,
      },
    });
  }

  addAlias(name, alias) {
    debugSilly("adding alias: '%s' -> '%s'", name, alias);
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
    new AliasPlugin(
      'described-resolve',
      {name, onlyModule: false, alias},
      'internal-resolve',
    ).apply(this.resolver);
  }

  static isResolutionError(error) {
    return error.message.startsWith("Can't resolve");
  }

  async resolve(request) {
    try {
      return await new Promise((resolve, reject) => {
        this.resolver.resolve(nodeContext, FLECKS_CORE_ROOT, request, {}, (error, path) => {
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

};
