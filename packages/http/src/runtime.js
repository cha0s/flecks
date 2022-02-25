const {getOptions} = require('loader-utils');

module.exports = function FlecksRuntime() {
  const {source} = getOptions(this);
  return source;
};
