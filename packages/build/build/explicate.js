const {access, realpath} = require('fs/promises');
const {Module} = require('module');
const {
  delimiter,
  dirname,
  join,
  resolve,
} = require('path');

module.exports = async function explicate(
  {
    importer,
    paths: maybeAliasedPaths,
    platforms = ['server'],
    resolver,
  },
) {
  const dependentPaths = [];
  const roots = {};
  async function addRoot(path, request) {
    // Already added it?
    if (Object.keys(roots).some((rootPath) => path.startsWith(rootPath))) {
      return;
    }
    // Walk up and find the root, if any.
    const pathParts = path.split('/');
    const requestParts = path === request
      ? pathParts.slice()
      : resolve(resolver.root, request).split('/');
    /* eslint-disable no-await-in-loop */
    while (pathParts.length > 0 && requestParts.length > 0) {
      const candidate = requestParts.join('/');
      if (await resolver.resolve(join(candidate, 'package.json'))) {
        const rootPath = pathParts.join('/');
        // Don't add the root if this path doesn't actually exist.
        if (path !== rootPath && !await resolver.resolve(path)) {
          break;
        }
        // Resolve symlinks.
        const resolvedCandidate = dirname(await resolver.resolve(join(candidate, 'package.json')));
        let realResolvedCandidate = await realpath(resolvedCandidate);
        const isSymlink = resolvedCandidate !== realResolvedCandidate;
        if (isSymlink) {
          if (realResolvedCandidate.endsWith('/dist')) {
            realResolvedCandidate = realResolvedCandidate.slice(0, -5);
          }
        }
        // Aliased? Include submodules.
        if (path !== request) {
          const submodules = join(realResolvedCandidate, 'node_modules');
          resolver.addModules(submodules);
          // Runtime NODE_PATH hacking.
          const {env} = process;
          env.NODE_PATH = (env.NODE_PATH || '') + delimiter + submodules;
          // eslint-disable-next-line no-underscore-dangle
          Module._initPaths();
        }
        // Load `bootstrap.js`.
        const bootstrapPath = await resolver.resolve(join(candidate, 'build', 'flecks.bootstrap'));
        const bootstrap = bootstrapPath ? importer(bootstrapPath) : {};
        // First add dependencies.
        const {dependencies = []} = bootstrap;
        if (dependencies.length > 0) {
          await Promise.all(dependencies.map((dependency) => addRoot(dependency, dependency)));
          dependentPaths.push(...dependencies);
        }
        // Add root as a dependency.
        dependentPaths.push(rootPath);
        // Add root.
        roots[rootPath] = {
          bootstrap,
          request: isSymlink ? realResolvedCandidate : candidate,
        };
        break;
      }
      pathParts.pop();
      requestParts.pop();
    }
    /* eslint-enable no-await-in-loop */
  }
  // Normalize maybe aliased paths into path and request.
  const normalized = await Promise.all(
    maybeAliasedPaths.map(async (maybeAliasedPath) => {
      const index = maybeAliasedPath.indexOf(':');
      return -1 === index
        ? [maybeAliasedPath, maybeAliasedPath]
        : [maybeAliasedPath.slice(0, index), maybeAliasedPath.slice(index + 1)];
    }),
  );
  // Add roots.
  await Promise.all(normalized.map(([path, request]) => addRoot(path, request)));
  // Add aliases and fallbacks.
  await Promise.all(
    Object.entries(roots)
      .filter(([path, {request}]) => path !== request)
      .map(async ([path, {request}]) => {
        try {
          await access(join(request, 'src'));
          resolver.addAlias(path, join(request, 'src'));
        }
        // eslint-disable-next-line no-empty
        catch (error) {}
        resolver.addFallback(path, request);
      }),
  );
  const paths = (
    // Resolve dependent, normalized, and platform paths.
    await Promise.all(
      dependentPaths.map((path) => [path, path])
        .concat(normalized)
        .map(([path]) => path)
        .reduce((platformed, path) => (
          platformed.concat([path], platforms.map((platform) => join(path, platform)))
        ), [])
        .map(async (path) => [path, await resolver.resolve(path)]),
    )
  )
    // Filter unresolved except roots.
    .filter(([path, resolved]) => resolved || roots[path])
    .map(([path]) => path)
    // Filter excluded platforms.
    .filter((path) => (
      !platforms
        .filter((platform) => platform.startsWith('!'))
        .map((platform) => platform.slice(1))
        .some((excluded) => path.endsWith(`/${excluded}`))
    ));
  return {paths: [...new Set(paths)], roots};
};
