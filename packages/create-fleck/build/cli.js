#!/usr/bin/env node
/* eslint-disable camelcase */

const {
  basename,
  dirname,
  join,
  relative,
  sep,
} = require('path');

const addPathsToYml = require('@flecks/core/build/add-paths-to-yml');
const {program} = require('commander');
const {move} = require('@flecks/core/build/move');
const {
  build,
  install,
  JsonStream,
} = require('@flecks/core/src/server');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const {
  npm_config_local_prefix,
  npm_config_scope,
  npm_package_json,
} = process.env;

(async () => {
  program.argument('[path]', "the path of the fleck (e.g.: 'packages/foobar')");
  program.option('--no-add', 'do not add an entry to `build/flecks.yml`');
  program.option('--no-inherit-version', 'do not inherit root package version');
  program.option('--alias', 'alias the fleck in `build/flecks.yml`');
  program.option('--dry-run', 'just say what would be done without actually doing it');
  program.action(async (
    path,
    {
      alias,
      add,
      inheritVersion,
      packageManager,
    },
  ) => {
    try {
      if (!npm_config_local_prefix && !path) {
        throw new Error('name required');
      }
      const root = npm_config_local_prefix || FLECKS_CORE_ROOT;
      let rootJson;
      try {
        rootJson = require(join(root, 'package.json'));
      }
      // eslint-disable-next-line no-empty
      catch (error) {}
      let scope;
      if (npm_config_scope) {
        scope = npm_config_scope;
      }
      else if (rootJson?.name) {
        const inferredScope = rootJson.name.split('/')[0] || '';
        if (inferredScope.startsWith('@')) {
          scope = inferredScope;
        }
      }
      const local = basename(path || root);
      const name = scope ? `${scope}/${local}` : local;
      const fileTree = await move(name, join(__dirname, '..', 'template'));
      if (inheritVersion && rootJson?.version) {
        // Inherit version from monorepo root.
        const {version} = rootJson;
        fileTree.pipe('package.json', new JsonStream((json) => ({...json, version})));
      }
      // Write the tree.
      const destination = path ? join(root, path) : dirname(npm_package_json);
      await fileTree.writeTo(destination);
      // Install and build.
      await install({cwd: destination, packageManager});
      await build({cwd: destination, packageManager});
      if (add) {
        const maybeAliasedPath = [name]
          .concat(alias ? `.${sep}${relative(root, destination)}` : [])
          .join(':');
        try {
          await addPathsToYml([maybeAliasedPath], root);
        }
        // eslint-disable-next-line no-empty
        catch (error) {}
      }
    }
    catch (error) {
      // eslint-disable-next-line no-console
      console.error('creation failed:', error);
    }
  });
  await program.parseAsync(process.argv);
})();
