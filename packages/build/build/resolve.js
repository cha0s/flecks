const Resolver = require('./resolver');

module.exports = function resolve({aliases, fallbacks}, stubs) {
  const {Module} = require('module');
  const {require: Mr} = Module.prototype;
  const resolver = new Resolver({aliases, fallbacks, useSyncFileSystemCalls: true});
  Module.prototype.require = function hackedRequire(request, options) {
    for (let i = 0; i < stubs.length; ++i) {
      if (request.startsWith(stubs[i])) {
        return undefined;
      }
    }
    try {
      return Mr.call(this, request, options);
    }
    catch (error) {
      if (!error.message.startsWith('Cannot find module')) {
        throw error;
      }
      const resolved = resolver.resolveSync(request);
      if (!resolved) {
        throw error;
      }
      return Mr.call(this, resolved, options);
    }
  };
};
