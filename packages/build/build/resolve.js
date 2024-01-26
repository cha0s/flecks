const D = require('@flecks/core/build/debug');

const debug = D('@flecks/server/build/runtime');

const Resolver = require('./resolver');

module.exports = function resolve(resolverConfig, stubs) {
  debug('installing resolution magic');
  const {Module} = require('module');
  const {require: Mr} = Module.prototype;
  const resolver = new Resolver({
    ...resolverConfig,
    modules: [],
    useSyncFileSystemCalls: true,
  });
  Module.prototype.require = function flecksResolutionMagic(request, options) {
    for (let i = 0; i < stubs.length; ++i) {
      if (request.startsWith(stubs[i])) {
        return undefined;
      }
    }
    return Mr.call(this, resolver.resolveSync(request) || request, options);
  };
};
