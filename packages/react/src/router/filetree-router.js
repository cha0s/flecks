import {resolve} from 'path';

function filePathToSegmentPath(path) {
  let localPath = path;
  let suffix = '';
  // `-path` -> `path?`
  if (path.startsWith('-')) {
    localPath = path.slice(1);
    suffix = '?';
  }
  // `[...path]` -> `*`
  if (localPath.match(/^\[\.\.\..*\]$/)) {
    return '*';
  }
  // `[path]` -> `:path`
  if (localPath.match(/^\[.*\]$/)) {
    return `:${localPath.slice(1, -1)}${suffix}`;
  }
  return `${localPath}${suffix}`;
}

export async function createRoutesFromFiletree({importer, paths, resolver}) {
  const children = [{path: '/'}];
  const elements = [];
  const fix = [];
  const moduleMap = {};
  paths.forEach((path) => {
    const resolved = resolver(path);
    if (!moduleMap[resolved]) {
      moduleMap[resolved] = [];
    }
    moduleMap[resolved].push(path);
  });
  // Build initial router object.
  Object.entries(moduleMap)
    .map(([, paths]) => (
      // Second-longest: path without extension.
      paths
        .sort((l, r) => (l.length < r.length ? -1 : 1))
        .slice(0, -1)
        .pop()
    ))
    .sort((l, r) => (l < r ? -1 : 1))
    .forEach((path) => {
      let walk = children;
      const parts = ['/', ...resolve('/', path).split('/').slice(1)];
      const segments = parts.map(filePathToSegmentPath);
      for (let i = 0; i < segments.length; ++i) {
        const segment = segments[i];
        const end = parts.length - 1;
        // Colocation: bail.
        if (segment.startsWith('_')) {
          break;
        }
        // Create a new node if necessary.
        let route = walk.find(({path}) => segment === path);
        if (!route) {
          route = {path: segment};
          walk.push(route);
        }
        // Walking...
        if (i < end - 1) {
          if (!route.children) {
            route.children = [];
            fix.push(route.children);
          }
          route.children.route = route;
          route.children.parent = walk;
          walk = route.children;
        }
        // About to end, check last.
        if (i === end - 1) {
          const last = parts[i + 1];
          // Non-index is a sibling, create if necessary.
          if ('index' !== last) {
            const offset = '/' === parts[i] ? 1 : 0;
            const nestedPath = segments.slice(i + offset).join('/');
            route = walk.find(({path}) => nestedPath === path);
            if (!route) {
              route = {path: nestedPath};
              walk.push(route);
            }
          }
          elements.push([walk, route, path]);
          break;
        }
      }
    });
  // Mix imported modules into router object.
  await Promise.all(
    elements.map(async ([children, node, path]) => {
      const route = await importer(path);
      let {hoist} = route;
      if (hoist > 0) {
        const parts = node.path.split('/');
        children.splice(children.indexOf(node), 1);
        let walk = children;
        while (hoist--) {
          parts.unshift('/' !== walk.route.path ? walk.route.path : '');
          walk = walk.parent;
        }
        node.path = parts.join('/');
        walk.push(node);
      }
      Object.entries(route)
        .forEach(([key, value]) => {
          switch (key) {
            case 'children':
              // ???
              return;
            case 'hoist':
              return;
            case 'index':
              delete node.path;
              break;
            default:
          }
          node[key] = value;
        });
    }),
  );
  // Clean up the build junk.
  fix.forEach((children) => {
    if (0 === children.length) {
      delete children.route.children;
    }
    delete children.route;
    delete children.parent;
  });
  return children;
}

export async function createRoutesFromContext(context) {
  return createRoutesFromFiletree({
    paths: context.keys(),
    importer: context,
    resolver: context.resolve,
  });
}
