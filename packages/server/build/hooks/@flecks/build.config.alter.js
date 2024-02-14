const {banner} = require('@flecks/build/src/server');

exports.hook = ({server}, env, argv, flecks) => {
  if (server) {
    const resolver = JSON.stringify({
      alias: server.resolve.alias,
      fallback: server.resolve.fallback,
    });
    const stubs = JSON.stringify(flecks.stubs);
    if ('{"alias":{},"fallback":{}}' !== resolver || '[]' !== stubs) {
      server.plugins.push(
        banner({
          // `require()` magic.
          banner: `require('@flecks/core/build/resolve')(${resolver}, ${stubs})`,
          include: 'index.js',
        }),
      );
    }
  }
};
