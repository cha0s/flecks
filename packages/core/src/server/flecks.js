import {
  readFileSync,
  realpathSync,
  statSync,
} from 'fs';
import {
  basename,
  dirname,
  extname,
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
} = process.env;

const debug = D('@flecks/core/flecks/server');

export default class ServerFlecks extends Flecks {

  constructor(options = {}) {
    super(options);
    const {
      resolver = {},
      rcs = {},
    } = options;
    const keys = Object.keys(process.env);
    // Reverse-sorting means e.g. `@flecks/core/server` comes before `@flecks/core`.
    // We want to select the most specific match.
    //
    // `FLECKS_ENV_FLECKS_CORE_SERVER_VARIABLE` is ambiguous as it can equate to both:
    // - `flecks.set('@flecks/core.server.variable');`
    // - `flecks.set('@flecks/core/server.variable');`
    //
    // The latter will take precedence.
    const seen = [];
    Object.keys(this.flecks)
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
    this.buildConfigs = Object.fromEntries(
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
    this.resolver = resolver;
    this.rcs = rcs;
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
      platforms = ['server'],
      root = FLECKS_CORE_ROOT,
      without = [],
    } = {},
  ) {
    const resolvedRoot = resolve(FLECKS_CORE_ROOT, root);
    let initial;
    let configType;
    try {
      const {load} = R('js-yaml');
      const filename = join(resolvedRoot, 'build', 'flecks.yml');
      const buffer = readFileSync(filename, 'utf8');
      debug('parsing configuration from YML...');
      initial = load(buffer, {filename}) || {};
      configType = 'YML';
    }
    catch (error) {
      if ('ENOENT' !== error.code) {
        throw error;
      }
      initial = {'@flecks/core': {}, '@flecks/fleck': {}};
      configType = 'barebones';
    }
    debug('bootstrap configuration (%s): %O', configType, initial);
    // Fleck discovery.
    const aliased = {};
    const config = {};
    const resolver = {};
    const keys = Object.keys(initial);
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      const index = key.lastIndexOf(':');
      const [path, alias] = -1 === index ? [key, key] : [key.slice(0, index), key.slice(index + 1)];
      if (-1 !== without.indexOf(path.split('/').pop())) {
        // eslint-disable-next-line no-continue
        continue;
      }
      const aliasPath = '.'.charCodeAt(0) === alias.charCodeAt(0)
        ? join(resolvedRoot, alias)
        : alias;
      try {
        config[path] = initial[key];
        R.resolve(aliasPath);
        if (path !== alias) {
          aliased[path] = aliasPath;
        }
        resolver[path] = aliasPath;
      }
      // eslint-disable-next-line no-empty
      catch (error) {}
      // Discover platform-specific variants.
      if (platforms) {
        platforms.forEach((platform) => {
          try {
            const platformAliasPath = join(aliasPath, platform);
            const platformPath = join(path, platform);
            R.resolve(platformAliasPath);
            if (path !== alias) {
              aliased[platformPath] = platformAliasPath;
            }
            config[platformPath] = config[platformPath] || {};
            resolver[platformPath] = platformAliasPath;
          }
          // eslint-disable-next-line no-empty
          catch (error) {}
        });
      }
    }
    const paths = Object.keys(resolver);
    const rcs = {};
    const roots = Array.from(new Set(
      paths
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
    debug('rcs: %O', rcs);
    // Stub platform-unfriendly modules.
    const stubs = this.stubs(platforms, rcs);
    if (stubs.length > 0) {
      debug('stubbing: %O', stubs);
      const regex = new RegExp(stubs.join('|'));
      R('pirates').addHook(
        () => '',
        {
          ignoreNodeModules: false,
          matcher: (path) => !!path.match(regex),
        },
      );
    }
    // Flecks that are aliased or symlinked need compilation.
    const flecks = {};
    const needCompilation = paths
      .filter((path) => (
        this.fleckIsAliased(resolver, path) || this.fleckIsSymlinked(resolver, path)
      ));
    // Lookups redirect require() requests.
    const symlinked = paths
      .filter((path) => this.fleckIsSymlinked(resolver, path));
    if (symlinked.length > 0) {
      const lookups = {
        ...Object.fromEntries(
          symlinked
            .map((path) => [
              R.resolve(path),
              this.sourcepath(R.resolve(this.resolve(resolver, path))),
            ]),
        ),
      };
      debug('symlink lookups: %O', lookups);
      R('pirates').addHook(
        (code, path) => `module.exports = require('${lookups[path]}')`,
        {
          ignoreNodeModules: false,
          // eslint-disable-next-line arrow-body-style
          matcher: (path) => {
            return !!lookups[path];
          },
        },
      );
    }
    const {Module} = R('module');
    const aliases = this.aliases(rcs);
    debug('aliases: %O', aliases);
    // Nasty hax to give us FULL CONTROL.
    const {require: Mr} = Module.prototype;
    const requirers = {
      ...aliased,
      ...aliases,
    };
    Module.prototype.require = function hackedRequire(request, options) {
      if (requirers[request]) {
        return Mr.call(this, requirers[request], options);
      }
      return Mr.call(this, request, options);
    };
    if (needCompilation.length > 0) {
      const rcBabel = this.babel(rcs);
      debug('.flecksrc: babel: %O', rcBabel);
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
        debug('compiling: %s', root);
        const resolved = dirname(R.resolve(join(root, 'package.json')));
        const sourcepath = this.sourcepath(resolved);
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
        const register = R('@babel/register');
        const config = {
          configFile,
          // Augment the compiler with babel config from flecksrc.
          ...babelmerge(...rcBabel.map(([, babel]) => babel)),
          ignore: [resolve(join(sourcepath, '..', 'node_modules'))],
          only: [resolve(join(sourcepath, '..'))],
          sourceMaps: 'inline',
        };
        debug("require('@babel/register')(%O)", config);
        register({
          ...config,
          // Make webpack goodies exist in nodespace.
          plugins: [
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
          ],
        });
        compiling.forEach((fleck) => {
          flecks[fleck] = R(this.resolve(resolver, fleck));
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

  fleckIsSymlinked(fleck) {
    return this.constructor.fleckIsSymlinked(this.resolver, fleck);
  }

  static fleckIsSymlinked(resolver, fleck) {
    const resolved = R.resolve(this.resolve(resolver, fleck));
    const realpath = realpathSync(resolved);
    return realpath !== resolved;
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

  runtimeCompiler(runtime, neutrino, allowlist = []) {
    const {config} = neutrino;
    // Pull the default compiler.
    if (config.module.rules.has('compile')) {
      config.module.rules.delete('compile');
    }
    // Flecks that are aliased or symlinked need compilation.
    const needCompilation = Object.entries(this.resolver)
      .filter(([fleck]) => this.fleckIsAliased(fleck) || this.fleckIsSymlinked(fleck));
    if (needCompilation.length > 0) {
      const rcBabel = this.babel();
      debug('.flecksrc: babel: %O', rcBabel);
      // Alias and de-externalize.
      needCompilation
        .forEach(([fleck, resolved]) => {
          const alias = this.fleckIsAliased(fleck)
            ? resolved
            : this.sourcepath(R.resolve(this.resolve(fleck)));
          allowlist.push(`${fleck}$`);
          config.resolve.alias
            .set(`${fleck}$`, alias);
          debug('%s runtime de-externalized %s, alias: %s', runtime, fleck, alias);
        });
      // Set up compilation at each root.
      Array.from(new Set(
        needCompilation
          .map(([fleck]) => fleck)
          .map((fleck) => this.root(fleck)),
      ))
        .forEach((root) => {
          const resolved = dirname(R.resolve(join(root, 'package.json')));
          const sourcepath = this.sourcepath(resolved);
          const configFile = this.buildConfig('babel.config.js');
          debug('compiling: %s with %s', root, configFile);
          const babel = {
            configFile,
            // Augment the compiler with babel config from flecksrc.
            ...babelmerge(...rcBabel.map(([, babel]) => babel)),
          };
          compileLoader({
            ignore: [join(sourcepath, '..')],
            include: [join(sourcepath, '..')],
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
    const stubs = {};
    for (let i = 0; i < keys.length; ++i) {
      const key = keys[i];
      const config = rcs[key];
      if (config.stubs) {
        Object.entries(config.stubs)
          .forEach(([platform, paths]) => {
            if (-1 !== platforms.indexOf(platform)) {
              paths.forEach((path) => {
                stubs[path] = true;
              });
            }
          });
      }
    }
    return Object.keys(stubs);
  }

}
