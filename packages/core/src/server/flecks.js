import {
  readFileSync,
  realpathSync,
  statSync,
} from 'fs';
import {
  basename,
  dirname,
  extname,
  isAbsolute,
  join,
  resolve,
} from 'path';

import babelmerge from 'babel-merge';
import compileLoader from '@neutrinojs/compile-loader';

import R from '../bootstrap/require';
import D from '../debug';
import Flecks from '../flecks';

const {
  FLECKS_CORE_ROOT = process.cwd(),
  FLECKS_YML = 'flecks.yml',
} = process.env;

const debug = D('@flecks/core/flecks/server');

export default class ServerFlecks extends Flecks {

  constructor(options = {}) {
    super(options);
    this.overrideConfigFromEnvironment();
    this.buildConfigs = this.loadBuildConfigs();
    this.resolver = options.resolver || {};
    this.rcs = options.rcs || {};
  }

  aliases() {
    return this.constructor.aliases(this.rcs);
  }

  static aliases(rcs) {
    const keys = Object.keys(rcs);
    let aliases = {};
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      const config = rcs[key];
      if (config.aliases && Object.keys(config.aliases).length > 0) {
        aliases = {...aliases, ...config.aliases};
      }
    }
    return aliases;
  }

  babel() {
    return this.constructor.babel(this.rcs);
  }

  static babel(rcs) {
    return Object.entries(rcs)
      .filter(([, {babel}]) => babel)
      .map(([key, {babel}]) => [key, babel]);
  }

  static bootstrap(
    {
      config,
      platforms = ['server'],
      root = FLECKS_CORE_ROOT,
    } = {},
  ) {
    // Load or use parameterized configuration.
    let configType;
    if (!config) {
      // eslint-disable-next-line no-param-reassign
      [configType, config] = this.loadConfig(root);
    }
    else {
      configType = 'parameter';
    }
    debug('bootstrap configuration (%s): %O', configType, config);
    // Fleck discovery.
    const resolvedRoot = resolve(FLECKS_CORE_ROOT, root);
    const resolver = {};
    const keys = Object.keys(config);
    // `!platform` excludes that platform.
    const without = platforms
      .filter((platform) => '!'.charCodeAt(0) === platform.charCodeAt(0))
      .map((platform) => platform.slice(1));
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      // Parse the alias (if any).
      const index = key.indexOf(':');
      const [path, alias] = -1 === index
        ? [key, undefined]
        : [key.slice(0, index), key.slice(index + 1)];
      // Run it by the exception list.
      if (-1 !== without.indexOf(path.split('/').pop())) {
        // eslint-disable-next-line no-continue
        continue;
      }
      // Resolve the path (if necessary).
      let resolvedPath;
      if (alias) {
        resolvedPath = isAbsolute(alias) ? alias : join(resolvedRoot, alias);
      }
      else {
        resolvedPath = path;
      }
      try {
        R.resolve(resolvedPath);
        resolver[path] = resolvedPath;
      }
      // eslint-disable-next-line no-empty
      catch (error) {}
      // Discover platform-specific variants.
      if (platforms) {
        platforms.forEach((platform) => {
          try {
            const resolvedPlatformPath = join(resolvedPath, platform);
            R.resolve(resolvedPlatformPath);
            resolver[join(path, platform)] = resolvedPlatformPath;
          }
          // eslint-disable-next-line no-empty
          catch (error) {}
        });
      }
    }
    // Rewrite aliased config keys.
    // eslint-disable-next-line no-param-reassign
    config = Object.fromEntries(
      Object.entries(config)
        .map(([key, value]) => {
          const index = key.indexOf(':');
          return [-1 !== index ? key.slice(0, index) : key, value];
        }),
    );
    const paths = Object.keys(resolver);
    // Load RCs.
    const rcs = this.loadRcs(resolver);
    debug('rcs: %O', rcs);
    // Merge aliases;
    const aliases = {
      // from fleck configuration above,
      ...Object.fromEntries(Object.entries(resolver).filter(([from, to]) => from !== to)),
      // from symlinks,
      ...(
        Object.fromEntries(
          paths.filter((path) => this.fleckIsSymlinked(resolver, path))
            .map((path) => [path, this.sourcepath(R.resolve(this.resolve(resolver, path)))]),
        )
      ),
      // and from RCs.
      ...this.aliases(rcs),
    };
    if (Object.keys(aliases).length > 0) {
      debug('aliases: %O', aliases);
    }
    // Stub server-unfriendly modules.
    const stubs = this.stubs(['server'], rcs);
    if (stubs.length > 0) {
      debug('stubbing: %O', stubs);
    }
    // Do we need to get up in `require()`'s guts?
    if (
      Object.keys(aliases).length > 0
      || stubs.length > 0
    ) {
      const {Module} = R('module');
      const {require: Mr} = Module.prototype;
      Module.prototype.require = function hackedRequire(request, options) {
        for (let i = 0; i < stubs.length; ++i) {
          if (request.match(stubs[i])) {
            return undefined;
          }
        }
        if (aliases[request]) {
          return Mr.call(this, aliases[request], options);
        }
        return Mr.call(this, request, options);
      };
    }
    // Compile.
    const flecks = {};
    const needCompilation = paths
      .filter((path) => this.fleckIsCompiled(resolver, path));
    if (needCompilation.length > 0) {
      const register = R('@babel/register');
      // Augment the compiler with babel config from flecksrc.
      const rcBabelConfig = babelmerge(...this.babel(rcs).map(([, babel]) => babel));
      debug('.flecksrc: babel: %O', rcBabelConfig);
      // Key flecks needing compilation by their roots, so we can compile all common roots with a
      // single invocation of `@babel/register`.
      const compilationRootMap = {};
      needCompilation.forEach((fleck) => {
        const root = this.root(resolver, fleck);
        if (!compilationRootMap[root]) {
          compilationRootMap[root] = [];
        }
        compilationRootMap[root].push(fleck);
      });
      // Register a compiler for each root and require() the flecks underneath.
      Object.entries(compilationRootMap).forEach(([root, compiling]) => {
        debug('compiling at root: %s', root);
        const resolved = dirname(R.resolve(join(root, 'package.json')));
        const sourcepath = this.sourcepath(resolved);
        const sourceroot = join(sourcepath, '..');
        // Load babel config from whichever we find first:
        // - The fleck being compiled's build directory
        // - The root build directory
        // - Finally, the built-in babel config
        const configFile = this.resolveBuildConfig(
          resolver,
          [
            resolved,
            FLECKS_CORE_ROOT,
            this.resolvePath(resolver, '@flecks/core/server'),
          ],
          [
            'babel.config.js',
          ],
        );
        const config = {
          // Augment the selected config with the babel config from RCs.
          configFile,
          // Target the compiler to avoid unnecessary work.
          ignore: [resolve(join(sourceroot, 'node_modules'))],
          only: [resolve(sourceroot)],
        };
        debug("require('@babel/register')(%O)", config);
        register({
          ...config,
          ...rcBabelConfig,
          // Make webpack goodies exist in nodespace.
          plugins: this.nodespaceBabelPlugins(),
          // Keep things debuggable.
          sourceMaps: 'inline',
        });
        compiling.forEach((fleck) => {
          debug('compiling %s...', fleck);
          flecks[fleck] = R(this.resolve(resolver, fleck));
          debug('compiled');
          // Remove the required fleck from the list still needing require().
          paths.splice(paths.indexOf(fleck), 1);
        });
        // Don't pollute, kids.
        register.revert();
      });
    }
    // Load the rest of the flecks.
    paths.forEach((path) => {
      flecks[path] = R(this.resolve(resolver, path));
    });
    return new ServerFlecks({
      config,
      flecks,
      platforms,
      rcs,
      resolver,
    });
  }

  buildConfig(path, specific) {
    const config = this.buildConfigs[path];
    if (!config) {
      throw new Error(`Unknown build config '${path}'`);
    }
    const paths = [];
    if (config.specifier) {
      paths.push(config.specifier(specific));
    }
    paths.push(path);
    const roots = [config.root];
    if (config.root !== FLECKS_CORE_ROOT) {
      roots.push(FLECKS_CORE_ROOT);
    }
    roots.push(this.resolvePath(this.resolve(config.fleck)));
    return this.constructor.resolveBuildConfig(this.resolver, roots, paths);
  }

  static environmentalize(key) {
    return key
      // - `@flecks/core` -> `FLECKS_CORE`
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_*(.*)_*/, '$1')
      .toUpperCase();
  }

  fleckIsAliased(fleck) {
    return this.constructor.fleckIsAliased(this.resolver, fleck);
  }

  static fleckIsAliased(resolver, fleck) {
    return fleck !== this.resolve(resolver, fleck);
  }

  fleckIsCompiled(fleck) {
    return this.constructor.fleckIsCompiled(this.resolver, fleck);
  }

  static fleckIsCompiled(resolver, fleck) {
    return this.fleckIsAliased(resolver, fleck) || this.fleckIsSymlinked(resolver, fleck);
  }

  fleckIsSymlinked(fleck) {
    return this.constructor.fleckIsSymlinked(this.resolver, fleck);
  }

  static fleckIsSymlinked(resolver, fleck) {
    const resolved = R.resolve(this.resolve(resolver, fleck));
    const realpath = realpathSync(resolved);
    return realpath !== resolved;
  }

  loadBuildConfigs() {
    return Object.fromEntries(
      Object.entries(this.invoke('@flecks/core.build.config'))
        .map(([fleck, configs]) => (
          configs.map((config) => {
            const defaults = {
              fleck,
              root: FLECKS_CORE_ROOT,
            };
            if (Array.isArray(config)) {
              return [config[0], {...defaults, ...config[1]}];
            }
            return [config, defaults];
          })
        ))
        .flat(),
    );
  }

  static loadConfig(root) {
    const resolvedRoot = resolve(FLECKS_CORE_ROOT, root);
    try {
      const {load} = R('js-yaml');
      const filename = join(resolvedRoot, 'build', FLECKS_YML);
      const buffer = readFileSync(filename, 'utf8');
      debug('parsing configuration from YML...');
      return ['YML', load(buffer, {filename}) || {}];
    }
    catch (error) {
      if ('ENOENT' !== error.code) {
        throw error;
      }
      return ['barebones', {'@flecks/core': {}, '@flecks/fleck': {}}];
    }
  }

  static loadRcs(resolver) {
    const rcs = {};
    const roots = Array.from(new Set(
      Object.keys(resolver)
        .map((path) => this.root(resolver, path))
        .filter((e) => !!e),
    ));
    for (let i = 0; i < roots.length; ++i) {
      const root = roots[i];
      try {
        rcs[root] = R(join(root, 'build', '.flecksrc'));
      }
      catch (error) {
        if ('MODULE_NOT_FOUND' !== error.code) {
          throw error;
        }
      }
    }
    return rcs;
  }

  static nodespaceBabelPlugins() {
    return [
      [
        'prepend',
        {
          prepend: [
            'require.context = (',
            '  directory,',
            '  useSubdirectories = true,',
            '  regExp = /^\\.\\/.*$/,',
            '  mode = "sync",',
            ') => {',
            '  const glob = require("glob");',
            '  const {resolve, sep} = require("path");',
            '  const keys = glob.sync(',
            '    useSubdirectories ? "**/*" : "*",',
            '    {cwd: resolve(__dirname, directory)},',
            '  )',
            '    .filter((key) => key.match(regExp))',
            '    .map(',
            '      (key) => (',
            '        -1 !== [".".charCodeAt(0), "/".charCodeAt(0)].indexOf(key.charCodeAt(0))',
            '          ? key',
            '          : ("." + sep + key)',
            '      ),',
            '    );',
            '  const R = (request) => require(keys[request]);',
            '  R.id = __filename',
            '  R.keys = () => keys;',
            '  return R;',
            '};',
          ].join('\n'),
        },
        'require.context',
      ],
      [
        'prepend',
        {
          prepend: 'const __non_webpack_require__ = require;',
        },
        '__non_webpack_require__',
      ],
      [
        'prepend',
        {
          prepend: "require('source-map-support/register');",
        },
        'source-map-support',
      ],
    ];
  }

  overrideConfigFromEnvironment() {
    const keys = Object.keys(process.env);
    const seen = [];
    Object.keys(this.flecks)
      // Reverse-sorting means e.g. `@flecks/core/server` comes before `@flecks/core`.
      // We want to select the most specific match.
      //
      // `FLECKS_ENV_FLECKS_CORE_SERVER_VARIABLE` is ambiguous as it can equate to both:
      // - `flecks.set('@flecks/core.server.variable');`
      // - `flecks.set('@flecks/core/server.variable');`
      //
      // The latter will take precedence.
      .sort((l, r) => (l < r ? 1 : -1))
      .forEach((fleck) => {
        const prefix = `FLECKS_ENV_${this.constructor.environmentalize(fleck)}`;
        keys
          .filter((key) => key.startsWith(`${prefix}_`) && -1 === seen.indexOf(key))
          .map((key) => {
            seen.push(key);
            debug('reading environment from %s...', key);
            return [key, process.env[key]];
          })
          .map(([key, value]) => [key.slice(prefix.length + 1), value])
          .map(([subkey, value]) => [subkey.split('_'), value])
          .forEach(([path, jsonOrString]) => {
            try {
              this.set([fleck, ...path], JSON.parse(jsonOrString));
              debug('read (%s) as JSON', jsonOrString);
            }
            catch (error) {
              this.set([fleck, ...path], jsonOrString);
              debug('read (%s) as string', jsonOrString);
            }
          });
      });
  }

  rcs() {
    return this.rcs;
  }

  resolve(path) {
    return this.constructor.resolve(this.resolver, path);
  }

  static resolve(resolver, fleck) {
    return resolver[fleck] || fleck;
  }

  resolveBuildConfig(roots, paths) {
    return this.constructor.resolveBuildConfig(this.resolver, roots, paths);
  }

  static resolveBuildConfig(resolver, roots, paths) {
    for (let i = 0; i < roots.length; ++i) {
      const root = roots[i];
      for (let j = 0; j < paths.length; ++j) {
        const path = paths[j];
        const resolved = join(root, 'build', path);
        try {
          statSync(resolved);
          return resolved;
        }
        // eslint-disable-next-line no-empty
        catch (error) {}
      }
    }
    throw new Error(`Couldn't resolve build file '${paths.pop()}'`);
  }

  resolvePath(path) {
    return this.constructor.resolvePath(this.resolver, path);
  }

  static resolvePath(resolver, path) {
    const resolved = R.resolve(this.resolve(resolver, path));
    const ext = extname(resolved);
    const base = basename(resolved, ext);
    return join(dirname(resolved), 'index' === base ? '' : base);
  }

  root(fleck) {
    return this.constructor.root(this.resolver, fleck);
  }

  static root(resolver, fleck) {
    const parts = this.resolve(resolver, fleck).split('/');
    try {
      R.resolve(parts.join('/'));
    }
    catch (error) {
      return undefined;
    }
    while (parts.length > 0) {
      try {
        R.resolve(join(parts.join('/'), 'package.json'));
        return parts.join('/');
      }
      catch (error) {
        parts.pop();
      }
    }
    return undefined;
  }

  runtimeCompiler(resolver, runtime, neutrino, {additionalModuleDirs = [], allowlist = []} = {}) {
    const {config} = neutrino;
    // Pull the default compiler.
    if (config.module.rules.has('compile')) {
      config.module.rules.delete('compile');
    }
    // Compile.
    const needCompilation = Object.entries(resolver)
      .filter(([fleck]) => this.constructor.fleckIsCompiled(resolver, fleck));
    if (needCompilation.length > 0) {
      const rcBabel = this.babel();
      debug('.flecksrc: babel: %O', rcBabel);
      // Alias and de-externalize.
      needCompilation
        .forEach(([fleck, resolved]) => {
          const alias = this.constructor.fleckIsAliased(resolver, fleck)
            ? resolved
            : this.constructor.sourcepath(R.resolve(this.constructor.resolve(resolver, fleck)));
          allowlist.push(fleck);
          config.resolve.alias
            .set(`${fleck}$`, alias);
          debug('%s runtime de-externalized %s, alias: %s', runtime, fleck, alias);
        });
      // Set up compilation at each root.
      Array.from(new Set(
        needCompilation
          .map(([fleck]) => fleck)
          .map((fleck) => this.constructor.root(resolver, fleck)),
      ))
        .forEach((root) => {
          const resolved = dirname(R.resolve(join(root, 'package.json')));
          const sourcepath = this.constructor.sourcepath(resolved);
          const sourceroot = join(sourcepath, '..');
          additionalModuleDirs.push(join(sourceroot, 'node_modules'));
          const configFile = this.buildConfig('babel.config.js');
          debug('compiling: %s with %s', root, configFile);
          const babel = {
            configFile,
            // Augment the compiler with babel config from flecksrc.
            ...babelmerge(...rcBabel.map(([, babel]) => babel)),
          };
          compileLoader({
            ignore: [sourceroot],
            include: [sourceroot],
            babel,
            ruleId: `@flecks/${runtime}/runtime/compile[${root}]`,
          })(neutrino);
        });
    }
  }

  sourcepath(fleck) {
    return this.constructor.sourcepath(fleck);
  }

  static sourcepath(path) {
    let sourcepath = realpathSync(path);
    const parts = sourcepath.split('/');
    const indexOf = parts.lastIndexOf('dist');
    if (-1 !== indexOf) {
      parts.splice(indexOf, 1, 'src');
      sourcepath = parts.join('/');
      sourcepath = join(dirname(sourcepath), basename(sourcepath, extname(sourcepath)));
    }
    else {
      sourcepath = join(sourcepath, 'src');
    }
    return sourcepath;
  }

  stubs() {
    return this.constructor.stubs(this.platforms, this.rcs);
  }

  static stubs(platforms, rcs) {
    const keys = Object.keys(rcs);
    const stubs = [];
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      const config = rcs[key];
      if (config.stubs) {
        Object.entries(config.stubs)
          .forEach(([platform, patterns]) => {
            if (-1 !== platforms.indexOf(platform)) {
              patterns.forEach((pattern) => {
                stubs.push(pattern);
              });
            }
          });
      }
    }
    return stubs;
  }

}
