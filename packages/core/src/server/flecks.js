import {
  readFileSync,
  realpathSync,
  statSync,
} from 'fs';
import {readFile, writeFile} from 'fs/promises';
import {
  basename,
  dirname,
  extname,
  isAbsolute,
  join,
  resolve,
  sep,
} from 'path';

import babelmerge from 'babel-merge';
import enhancedResolve from 'enhanced-resolve';
import {dump as dumpYml, load as loadYml} from 'js-yaml';
import {addHook} from 'pirates';

import D from '../debug';
import Flecks from '../flecks';
import R from '../require';
import Compiler from './compiler';

const {
  FLECKS_CORE_ROOT = process.cwd(),
  FLECKS_YML = 'flecks.yml',
} = process.env;

const debug = D('@flecks/core/flecks/server');
const debugSilly = debug.extend('silly');

export default class ServerFlecks extends Flecks {

  constructor(options = {}) {
    super(options);
    this.overrideConfigFromEnvironment();
    this.buildConfigs = {};
    this.loadBuildConfigs();
    this.flecksConfig = options.flecksConfig || {};
    this.resolver = options.resolver || {};
  }

  static async addFleckToYml(fleck, path) {
    const key = [fleck].concat(path ? `.${sep}${join('packages', path, 'src')}` : []).join(':');
    const ymlPath = join(FLECKS_CORE_ROOT, 'build', 'flecks.yml');
    let yml = loadYml(await readFile(ymlPath));
    yml = Object.fromEntries(Object.entries(yml).concat([[key, {}]]));
    await writeFile(ymlPath, dumpYml(yml, {sortKeys: true}));
  }

  get aliasedConfig() {
    const aliases = this.aliases();
    return Object.fromEntries(
      Object.entries(
        this.config,
      )
        .map(([path, config]) => [
          this.fleckIsAliased(path) ? `${path}:${aliases[path]}` : path,
          config,
        ]),
    );
  }

  aliases() {
    return this.constructor.aliases(this.flecksConfig);
  }

  static aliases(flecksConfig) {
    const keys = Object.keys(flecksConfig);
    let aliases = {};
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      const config = flecksConfig[key];
      if (config.aliases && Object.keys(config.aliases).length > 0) {
        aliases = {...aliases, ...config.aliases};
      }
    }
    return aliases;
  }

  babel() {
    return this.constructor.babel(this.flecksConfig);
  }

  static babel(flecksConfig) {
    return Object.entries(flecksConfig)
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
    debug('bootstrap configuration (%s)', configType);
    debugSilly(config);
    // Make resolver and load flecksConfig.
    const {flecksConfig, resolver} = this.makeResolverAndLoadRcs(
      Object.keys(config),
      platforms,
      root,
    );
    // Rewrite aliased config keys.
    // eslint-disable-next-line no-param-reassign
    config = Object.fromEntries(
      Object.entries(config)
        .map(([key, value]) => {
          const index = key.indexOf(':');
          return [-1 !== index ? key.slice(0, index) : key, value];
        }),
    );
    this.installCompilers(flecksConfig, resolver);
    // Instantiate with mixins.
    return ServerFlecks.from({
      config,
      flecks: Object.fromEntries(
        Object.keys(resolver)
          .map((path) => [path, R(this.resolve(resolver, path))]),
      ),
      platforms,
      flecksConfig,
      resolver,
    });
  }

  buildConfig(path, specific) {
    const config = this.buildConfigs[path];
    if (!config) {
      throw new Error(`Unknown build config '${path}'`);
    }
    const paths = [];
    if (specific) {
      if ('specifier' in config) {
        if (false === config.specifier) {
          paths.shift();
        }
        else {
          paths.push(config.specifier(specific));
        }
      }
      else {
        paths.push(`${specific}.${path}`);
      }
    }
    paths.push(path);
    const roots = [config.root];
    if (config.root !== FLECKS_CORE_ROOT) {
      roots.push(FLECKS_CORE_ROOT);
    }
    roots.push(this.resolvePath(this.resolve(config.fleck)));
    return this.constructor.resolveBuildConfig(this.resolver, roots, paths);
  }

  static environmentalize(path) {
    return path
      // - `@flecks/core` -> `flecks_core`
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/_*(.*)_*/, '$1');
  }

  exts() {
    return this.constructor.exts(this.flecksConfig);
  }

  static exts(flecksConfig) {
    const keys = Object.keys(flecksConfig);
    const exts = [];
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      const config = flecksConfig[key];
      if (config.exts) {
        exts.push(...config.exts);
      }
    }
    return exts;
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

  static installCompilers(flecksConfig, resolver) {
    const paths = Object.keys(resolver);
    debugSilly('flecksConfig: %O', flecksConfig);
    // Merge aliases;
    const aliases = Object.fromEntries(
      Object.entries({
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
        ...this.aliases(flecksConfig),
      })
        .map(([from, to]) => [from, to.endsWith('/index') ? to.slice(0, -6) : to]),
    );
    if (Object.keys(aliases).length > 0) {
      debugSilly('aliases: %O', aliases);
    }
    const exts = this.exts(flecksConfig);
    const enhancedResolver = enhancedResolve.create.sync({
      extensions: exts,
      alias: aliases,
    });
    // Stub server-unfriendly modules.
    const stubs = this.stubs(['server'], flecksConfig);
    if (stubs.length > 0) {
      debugSilly('stubbing: %O', stubs);
    }
    // Do we need to get up in `require()`'s guts?
    if (
      Object.keys(aliases).length > 0
      || stubs.length > 0
    ) {
      const {Module} = R('module');
      const {require: Mr} = Module.prototype;
      const aliasKeys = Object.keys(aliases);
      Module.prototype.require = function hackedRequire(request, options) {
        for (let i = 0; i < stubs.length; ++i) {
          if (request.match(stubs[i])) {
            return undefined;
          }
        }
        if (aliasKeys.find((aliasKey) => request.startsWith(aliasKey))) {
          try {
            const resolved = enhancedResolver(FLECKS_CORE_ROOT, request);
            if (resolved) {
              return Mr.call(this, resolved, options);
            }
          }
          // eslint-disable-next-line no-empty
          catch (error) {}
        }
        return Mr.call(this, request, options);
      };
    }
    // Compile.
    const compilations = [];
    const needCompilation = paths
      .filter((path) => this.fleckIsCompiled(resolver, path));
    if (needCompilation.length > 0) {
      // Augment the compilations with babel config from flecksrc.
      const flecksBabelConfig = babelmerge.all(this.babel(flecksConfig).map(([, babel]) => babel));
      debugSilly('.flecksrc: babel: %O', flecksBabelConfig);
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
      // Register a compilation for each root.
      Object.entries(compilationRootMap).forEach(([root, compiling]) => {
        const resolved = dirname(R.resolve(join(root, 'package.json')));
        const sourcepath = this.sourcepath(resolved);
        const sourceroot = join(sourcepath, '..');
        // Load babel config from whichever we find first:
        // - The fleck being compiled's build directory
        // - The root build directory
        // - Finally, the built-in babel config
        let builtInPath;
        try {
          builtInPath = this.resolvePath(resolver, '@flecks/core/server');
        }
        catch (error) {
          // This file won't be resolved during testing.
          builtInPath = join(__dirname, '..', 'src', 'server');
        }
        const configFile = this.resolveBuildConfig(
          resolver,
          [
            resolved,
            FLECKS_CORE_ROOT,
            builtInPath,
          ],
          [
            'babel.config.js',
          ],
        );
        const ignore = `${resolve(join(sourceroot, 'node_modules'))}/`;
        const only = `${resolve(sourceroot)}/`;
        const config = {
          // Augment the selected config with the babel config from RCs.
          configFile,
          // Target the compiler to avoid unnecessary work.
          ignore: [ignore],
          only: [only],
        };
        debugSilly('compiling %O with %j at %s', compiling, config, only);
        compilations.push({
          ignore,
          only,
          compiler: new Compiler(babelmerge(config, flecksBabelConfig)),
        });
      });
    }
    const findCompiler = (request) => {
      for (let i = 0; i < compilations.length; ++i) {
        const {compiler, ignore, only} = compilations[i];
        if (request.startsWith(only) && !request.startsWith(ignore)) {
          return compiler;
        }
      }
      return undefined;
    };
    debugSilly('pirating exts: %O', exts);
    addHook(
      (code, request) => {
        const compilation = findCompiler(request).compile(code, request);
        return null === compilation ? code : compilation.code;
      },
      {exts, matcher: (request) => !!findCompiler(request)},
    );
  }

  loadBuildConfigs() {
    Object.entries(this.invoke('@flecks/core.build.config'))
      .forEach(([fleck, configs]) => {
        configs.forEach((config) => {
          const defaults = {
            fleck,
          };
          if (Array.isArray(config)) {
            this.registerBuildConfig(config[0], {...defaults, ...config[1]});
          }
          this.registerBuildConfig(config, defaults);
        });
      });
  }

  static loadConfig(root) {
    const resolvedRoot = resolve(FLECKS_CORE_ROOT, root);
    try {
      const {load} = R('js-yaml');
      const filename = join(resolvedRoot, 'build', FLECKS_YML);
      const buffer = readFileSync(filename, 'utf8');
      debugSilly('parsing configuration from YML...');
      return ['YML', load(buffer, {filename}) || {}];
    }
    catch (error) {
      if ('ENOENT' !== error.code) {
        throw error;
      }
      return ['barebones', {'@flecks/core': {}, '@flecks/fleck': {}}];
    }
  }

  static makeResolver(maybeAliasedPath, platforms, root) {
    const resolvedRoot = resolve(FLECKS_CORE_ROOT, root);
    const resolver = {};
    // `!platform` excludes that platform.
    const without = platforms
      .filter((platform) => '!'.charCodeAt(0) === platform.charCodeAt(0))
      .map((platform) => platform.slice(1));
    // Parse the alias (if any).
    const index = maybeAliasedPath.indexOf(':');
    const [path, alias] = -1 === index
      ? [maybeAliasedPath, undefined]
      : [maybeAliasedPath.slice(0, index), maybeAliasedPath.slice(index + 1)];
    // Run it by the exception list.
    if (-1 !== without.indexOf(path.split('/').pop())) {
      // eslint-disable-next-line no-continue
      return {};
    }
    // Resolve the path (if necessary).
    let resolvedPath;
    if (alias) {
      resolvedPath = isAbsolute(alias) ? alias : join(resolvedRoot, alias);
    }
    else {
      if (path.startsWith('.')) {
        throw new Error(`non-aliased relative path '${path}' in configuration`);
      }
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
    return resolver;
  }

  static makeResolverAndLoadRcs(
    maybeAliasedPaths,
    platforms = ['server'],
    root = FLECKS_CORE_ROOT,
  ) {
    const resolver = {};
    const rootsFrom = (paths) => (
      Array.from(new Set(
        paths
          .map((path) => this.root(resolver, path))
          .filter((e) => !!e),
      ))
    );
    for (let i = 0; i < maybeAliasedPaths.length; ++i) {
      const maybeAliasedPath = maybeAliasedPaths[i];
      Object.entries(this.makeResolver(maybeAliasedPath, platforms, root))
        .forEach(([path, alias]) => {
          resolver[path] = alias;
        });
    }
    const flecksConfig = {};
    const roots = Array.from(new Set(
      rootsFrom(Object.keys(resolver))
        .concat(FLECKS_CORE_ROOT),
    ));
    let rootsToScan = roots;
    while (rootsToScan.length > 0) {
      const dependencies = [];
      for (let i = 0; i < rootsToScan.length; ++i) {
        const root = rootsToScan[i];
        try {
          flecksConfig[root] = R(join(root, 'build', 'flecks.config'));
          const {dependencies: flecksConfigDependencies = []} = flecksConfig[root];
          dependencies.push(...flecksConfigDependencies);
          flecksConfigDependencies.forEach((dependency) => {
            Object.entries(this.makeResolver(dependency, platforms, root))
              .forEach(([path, alias]) => {
                resolver[path] = alias;
              });
          });
        }
        catch (error) {
          if ('MODULE_NOT_FOUND' !== error.code) {
            throw error;
          }
        }
      }
      rootsToScan = rootsFrom(dependencies)
        .filter((root) => !flecksConfig[root]);
    }
    return {flecksConfig, resolver};
  }

  overrideConfigFromEnvironment() {
    const keys = Object.keys(process.env);
    const seen = [];
    Object.keys(this.flecks)
      .sort((l, r) => (l < r ? 1 : -1))
      .forEach((fleck) => {
        const prefix = `FLECKS_ENV__${this.constructor.environmentalize(fleck)}`;
        keys
          .filter((key) => key.startsWith(`${prefix}__`) && -1 === seen.indexOf(key))
          .map((key) => {
            seen.push(key);
            debug('reading environment from %s...', key);
            return [key, process.env[key]];
          })
          .map(([key, value]) => [key.slice(prefix.length + 2), value])
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

  flecksConfig() {
    return this.flecksConfig;
  }

  registerBuildConfig(filename, config) {
    const defaults = {
      root: FLECKS_CORE_ROOT,
    };
    this.buildConfigs[filename] = {...defaults, ...config};
  }

  registerResolver(from, to = from) {
    this.resolver[from] = to;
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
    const tried = [];
    for (let i = 0; i < roots.length; ++i) {
      const root = roots[i];
      for (let j = 0; j < paths.length; ++j) {
        const path = paths[j];
        const resolved = join(root, 'build', path);
        try {
          tried.push(resolved);
          statSync(resolved);
          return resolved;
        }
        // eslint-disable-next-line no-empty
        catch (error) {}
      }
    }
    throw new Error(`Couldn't resolve build file '${paths.pop()}', tried: ${tried.join(', ')}`);
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
      try {
        R.resolve(join(parts.join('/'), 'build', 'flecks.config'));
      }
      catch (error) {
        return undefined;
      }
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

  runtimeCompiler(resolver, runtime, config, {allowlist = []} = {}) {
    // Compile.
    const needCompilation = Object.entries(resolver)
      .filter(([fleck]) => this.constructor.fleckIsCompiled(resolver, fleck));
    if (needCompilation.length > 0) {
      const flecksBabelConfig = this.babel();
      debugSilly('flecks.config.js: babel: %O', flecksBabelConfig);
      // Alias and de-externalize.
      needCompilation
        .sort(([l], [r]) => (l < r ? 1 : -1))
        .forEach(([fleck, resolved]) => {
          let alias = this.constructor.fleckIsAliased(resolver, fleck)
            ? resolved
            : this.constructor.sourcepath(R.resolve(this.constructor.resolve(resolver, fleck)));
          alias = alias.endsWith('/index') ? alias.slice(0, -6) : alias;
          allowlist.push(fleck);
          config.resolve.alias[fleck] = alias;
          debugSilly('%s runtime de-externalized %s, alias: %s', runtime, fleck, alias);
        });
      // Set up compilation at each root.
      const compiledPaths = [];
      Array.from(new Set(
        needCompilation
          .map(([fleck]) => fleck)
          .map((fleck) => this.constructor.root(resolver, fleck)),
      ))
        .forEach((root) => {
          const resolved = dirname(R.resolve(join(root, 'package.json')));
          const sourcepath = this.constructor.sourcepath(resolved);
          const sourceroot = join(sourcepath, '..');
          compiledPaths.push(sourceroot);
          // @todo Ideally the fleck's 3rd party modules would be externalized.
          // Alias this compiled fleck's `node_modules` to the root `node_modules`.
          config.resolve.alias[join(sourceroot, 'node_modules')] = join(FLECKS_CORE_ROOT, 'node_modules');
          const configFile = this.buildConfig('babel.config.js');
          debugSilly('compiling: %s with %s', root, configFile);
          const babel = {
            configFile,
            // Augment the compiler with babel config from `flecks.config.js`.
            ...babelmerge.all(flecksBabelConfig.map(([, babel]) => babel)),
          };
          config.module.rules.push(
            {
              test: /\.(m?jsx?)?$/,
              include: [sourceroot],
              use: [
                {
                  loader: R.resolve('babel-loader'),
                  options: {
                    cacheDirectory: true,
                    babelrc: false,
                    configFile: false,
                    ...babel,
                  },
                },
              ],
            },
          );
        });
      const compiledPathsRegex = new RegExp(
        `(?:${compiledPaths.map((path) => path.replace(/[\\/]/g, '[\\/]')).join('|')})`,
      );
      if (!config.optimization) {
        config.optimization = {};
      }
      if (!config.optimization.splitChunks) {
        config.optimization.splitChunks = {};
      }
      if (!config.optimization.splitChunks.cacheGroups) {
        config.optimization.splitChunks.cacheGroups = {};
      }
      config.optimization.splitChunks.cacheGroups.flecksCompiled = {
        chunks: 'all',
        enforce: true,
        priority: 100,
        test: compiledPathsRegex,
      };
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
    return this.constructor.stubs(this.platforms, this.flecksConfig);
  }

  static stubs(platforms, flecksConfig) {
    const keys = Object.keys(flecksConfig);
    const stubs = [];
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      const config = flecksConfig[key];
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
