const {resolve: resolvePath} = require('path');

const D = require('./debug');

const debug = D('@flecks/core/build/resolve');

module.exports = function resolve({alias, fallback}, stubs) {
  debug('installing resolution magic');
  const {Module} = require('module');
  const {require: Mr} = Module.prototype;
  function preprocessMatchers(matchers) {
    return Object.entries(matchers)
      .map(([from, to]) => {
        if (false === to) {
          stubs.push(from);
          return undefined;
        }
        if (from.endsWith('$')) {
          return {
            exact: true,
            from: from.slice(0, -1),
            to,
          };
        }
        return {
          exact: false,
          from,
          to,
        };
      })
      .filter((entry) => entry);
  }
  function match(path, request, matchers) {
    for (let i = 0; i < matchers.length; ++i) {
      const {exact, from, to} = matchers[i];
      const resolvedFrom = resolvePath(path, from);
      const resolvedTo = resolvePath(path, to);
      if (exact) {
        if (resolvedFrom === request) {
          return request.replace(resolvedFrom, resolvedTo);
        }
      }
      else if (request.startsWith(resolvedFrom)) {
        return request.replace(resolvedFrom, resolvedTo);
      }
    }
    return undefined;
  }
  const aliases = preprocessMatchers(alias, stubs);
  const fallbacks = preprocessMatchers(fallback, stubs);
  Module.prototype.require = function flecksResolutionMagic(request, options) {
    for (let i = 0; i < stubs.length; ++i) {
      if (request.startsWith(stubs[i])) {
        return undefined;
      }
    }
    const qualified = resolvePath(this.path, request);
    let resolved = match(this.path, qualified, aliases);
    if (!resolved) {
      resolved = match(this.path, qualified, fallbacks);
    }
    if (!resolved) {
      resolved = request;
    }
    return Mr.call(this, resolved, options);
  };
  return () => {
    Module.prototype.require = Mr;
  };
};
