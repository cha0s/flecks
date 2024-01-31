// mocha tried...
module.exports = function FixMochaCriticalDependency(source) {
  return source
    .replace(
      'foundReporter = require.resolve(reporterName);',
      '// foundReporter = require.resolve(reporterName);',
    );
};
