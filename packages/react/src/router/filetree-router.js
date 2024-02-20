import {join, resolve} from 'path';

import {register} from 'react-refresh/runtime';

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
      paths
        .sort((l, r) => (l.length < r.length ? -1 : 1))
        .pop()
    ))
    .sort((l, r) => (l < r ? -1 : 1))
    .map((path) => {
      let trimmed = path;
      // @todo dynamic
      const extensions = ['.jsx', '.js', '.tsx', '.ts', '.mdx'];
      const extension = extensions.find((ext) => path.endsWith(ext));
      if (extension) {
        trimmed = path.slice(0, -extension.length);
      }
      return [path, trimmed];
    })
    .forEach(([path, trimmed]) => {
      let walk = children;
      const parts = ['/', ...resolve('/', trimmed).split('/').slice(1)];
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
            const nestedPath = join(...segments.slice(i));
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
      // React Refresh has trouble inferring component types when modules are structured as React
      // Router prefers (e.g. `const export index = true` not being a component export). We'll give
      // it a helping hand.
      register(route, `${path} %exports%`);
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
            case 'default':
              if (!route.Component) {
                node.Component = value;
              }
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
