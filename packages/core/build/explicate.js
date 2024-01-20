const {
  join,
  resolve,
} = require('path');

module.exports = async function explicate(
  maybeAliasedPaths,
  {
    importer,
    platforms = ['server'],
    resolver,
    root,
  },
) {
  const descriptors = {};
  const seen = {};
  const roots = {};
  function createDescriptor(maybeAliasedPath) {
    const index = maybeAliasedPath.indexOf(':');
    return -1 === index
      ? {
        path: maybeAliasedPath,
        request: maybeAliasedPath,
      }
      : {
        path: maybeAliasedPath.slice(0, index),
        request: resolve(root, maybeAliasedPath.slice(index + 1)),
      };
  }
  async function doExplication(descriptor) {
    const {path, request} = descriptor;
    if (
      platforms
        .filter((platform) => platform.startsWith('!'))
        .map((platform) => platform.slice(1))
        .includes(path.split('/').pop())
    ) {
      return;
    }
    if (path !== request) {
      resolver.addAlias(path, request);
    }
    descriptors[request] = descriptor;
  }
  async function getRootDescriptor(descriptor) {
    const {path, request} = descriptor;
    // Walk up and find the root, if any.
    const pathParts = path.split('/');
    const requestParts = request.split('/');
    let rootDescriptor;
    while (pathParts.length > 0 && requestParts.length > 0) {
      const candidate = requestParts.join('/');
      // eslint-disable-next-line no-await-in-loop
      if (await resolver.resolve(join(candidate, 'package.json'))) {
        rootDescriptor = {
          path: pathParts.join('/'),
          request: requestParts.join('/'),
        };
        break;
      }
      pathParts.pop();
      requestParts.pop();
    }
    return rootDescriptor;
  }
  function descriptorsAreTheSame(l, r) {
    return (l && !r) || (!l && r) ? false : l.request === r.request;
  }
  async function explicateDescriptor(descriptor) {
    if (descriptors[descriptor.request] || seen[descriptor.request]) {
      return;
    }
    seen[descriptor.request] = true;
    const areDescriptorsTheSame = descriptorsAreTheSame(
      descriptor,
      await getRootDescriptor(descriptor),
    );
    const resolved = await resolver.resolve(descriptor.request);
    if (resolved || areDescriptorsTheSame) {
      // eslint-disable-next-line no-use-before-define
      await explicateRoot(descriptor);
    }
    if (!resolved && areDescriptorsTheSame) {
      descriptors[descriptor.request] = descriptor;
    }
    if (resolved) {
      await doExplication(descriptor);
    }
    await Promise.all(
      platforms
        .filter((platform) => !platform.startsWith('!'))
        .map(async (platform) => {
          if (await resolver.resolve(join(descriptor.request, platform))) {
            return doExplication({
              path: join(descriptor.path, platform),
              request: join(descriptor.request, platform),
            });
          }
          if (await resolver.resolve(join(descriptor.request, 'src', platform))) {
            return doExplication({
              path: join(descriptor.path, platform),
              request: join(descriptor.request, 'src', platform),
            });
          }
          return undefined;
        }),
    );
  }
  async function explicateRoot(descriptor) {
    // Walk up and find the root, if any.
    const rootDescriptor = await getRootDescriptor(descriptor);
    if (!rootDescriptor || roots[rootDescriptor.request]) {
      return;
    }
    const {request} = rootDescriptor;
    roots[request] = true;
    // Import bootstrap script.
    const bootstrapPath = await resolver.resolve(join(request, 'build', 'flecks.bootstrap'));
    const bootstrap = bootstrapPath ? importer(bootstrapPath) : {};
    roots[request] = bootstrap;
    // Explicate dependcies.
    const {dependencies = []} = bootstrap;
    if (dependencies.length > 0) {
      await Promise.all(
        dependencies
          .map(createDescriptor)
          .map(explicateDescriptor),
      );
    }
    await explicateDescriptor(rootDescriptor);
  }
  await Promise.all(
    maybeAliasedPaths
      .map(createDescriptor)
      .map(explicateDescriptor),
  );
  return {
    descriptors,
    roots,
  };
};
