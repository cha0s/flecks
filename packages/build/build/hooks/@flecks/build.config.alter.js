const {externals} = require('../../webpack');

exports.hook = async ({test}, env, argv, flecks) => {
  if (test) {
    // Externalize the rest.
    test.externals = await externals({
      additionalModuleDirs: flecks.resolver.modules,
      allowlist: Object.keys(test.resolve.fallback).map((fallback) => new RegExp(fallback)),
    });
  }
};
