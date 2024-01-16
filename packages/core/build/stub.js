module.exports = function stub(stubs) {
  if (0 === stubs.length) {
    return;
  }
  const {Module} = require('module');
  const {require: Mr} = Module.prototype;
  Module.prototype.require = function hackedRequire(request, options) {
    for (let i = 0; i < stubs.length; ++i) {
      if (request.match(stubs[i])) {
        return undefined;
      }
    }
    return Mr.call(this, request, options);
  };
};
