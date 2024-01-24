const {join, relative, resolve} = require('path');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

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
    let descriptorRequest = descriptor.request;
    if (areDescriptorsTheSame) {
      descriptorRequest = join(descriptorRequest, 'src');
    }
    if (descriptor.path !== descriptor.request) {
      resolver.addAlias(descriptor.path, descriptorRequest);
      if (descriptorRequest !== descriptor.request) {
        resolver.addFallback(descriptor.path, descriptor.request);
      }
    }
    await Promise.all(
      platforms
        .filter((platform) => !platform.startsWith('!'))
        .map(async (platform) => {
          if (await resolver.resolve(join(descriptor.request, platform))) {
            const [path, request] = [
              join(descriptor.path, platform),
              join(descriptor.request, platform),
            ];
            await doExplication({path, request});
            if (path !== request) {
              resolver.addAlias(path, request);
            }
          }
          else if (await resolver.resolve(join(descriptorRequest, 'src', platform))) {
            const [path, request] = [
              join(descriptor.path, platform),
              join(descriptorRequest, 'src', platform),
            ];
            await doExplication({path, request});
            if (path !== request) {
              resolver.addAlias(path, request);
            }
          }
        }),
    );
  }
  async function explicateRoot(descriptor) {
    // Walk up and find the root, if any.
    const rootDescriptor = await getRootDescriptor(descriptor);
    if (!rootDescriptor || roots[rootDescriptor.request]) {
      return;
    }
    const {path, request} = rootDescriptor;
    if (path !== request) {
      resolver.addModules(relative(FLECKS_CORE_ROOT, join(request, 'node_modules')));
    }
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
