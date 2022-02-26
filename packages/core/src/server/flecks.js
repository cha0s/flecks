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
} from 'path';

import compileLoader from '@neutrinojs/compile-loader';
import D from 'debug';

import R from '../bootstrap/require';
import Flecks from '../flecks';

const {
  FLECKS_ROOT = process.cwd(),
} = process.env;

const debug = D('@flecks/core/flecks/server');

export default class ServerFlecks extends Flecks {

  constructor(options = {}) {
    super(options);
    const {
      resolver = {},
      rcs = {},
    } = options;
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

  static bootstrap(
    {
      platforms = ['server'],
      root = FLECKS_ROOT,
      without = [],
    } = {},
  ) {
    let initial;
    let configType;
    try {
      const {safeLoad} = R('js-yaml');
      const filename = join(root, 'build', 'flecks.yml');
      const buffer = readFileSync(filename, 'utf8');
      debug('parsing configuration from YML...');
      initial = safeLoad(buffer, {filename}) || {};
      configType = 'YML';
    }
    catch (error) {
      if ('ENOENT' !== error.code) {
        throw error;
      }
      initial = {'@flecks/core': {}};
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
        ? join(root, alias)
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
    const lookups = {
      ...Object.fromEntries(
        needCompilation
          .map((path) => [
            R.resolve(this.fleckIsAliased(resolver, path) ? aliased[path] : path),
            this.fleckIsAliased(resolver, path)
              ? aliased[path]
              : this.sourcepath(R.resolve(this.resolve(resolver, path))),
          ]),
      ),
    };
    debug('lookups: %O', lookups);
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
      const resolved = dirname(R.resolve(join(root, 'package.json')));
      const configFile = this.localConfig(
        resolver,
        'babel.config.js',
        '@flecks/core',
        {root: realpathSync(resolved)},
      );
      const register = R('@babel/register');
      register({
        cache: true,
        configFile,
        only: [this.sourcepath(resolved)],
        // Make webpack goodies exist in node land.
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

  localConfig(path, fleck, options) {
    return this.constructor.localConfig(this.resolver, path, fleck, options);
  }

  static localConfig(resolver, path, fleck, {general = path, root = FLECKS_ROOT} = {}) {
    let configFile;
    try {
      const localConfig = join(root, 'build', path);
      statSync(localConfig);
      configFile = localConfig;
    }
    catch (error) {
      try {
        const localConfig = join(root, 'build', general);
        statSync(localConfig);
        configFile = localConfig;
      }
      catch (error) {
        try {
          const localConfig = join(FLECKS_ROOT, 'build', path);
          statSync(localConfig);
          configFile = localConfig;
        }
        catch (error) {
          try {
            const localConfig = join(FLECKS_ROOT, 'build', general);
            statSync(localConfig);
            configFile = localConfig;
          }
          catch (error) {
            const resolved = this.resolve(resolver, fleck);
            try {
              configFile = R.resolve(join(resolved, 'build', path));
            }
            catch (error) {
              configFile = R.resolve(join(resolved, 'build', general));
            }
          }
        }
      }
    }
    return configFile;
  }

  rcs() {
    return this.rcs;
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

  resolve(path) {
    return this.constructor.resolve(this.resolver, path);
  }

  static resolve(resolver, fleck) {
    return resolver[fleck] || fleck;
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
    // Alias and de-externalize.
    needCompilation
      .forEach(([fleck, resolved]) => {
        const alias = this.fleckIsAliased(fleck)
          ? resolved
          : this.sourcepath(R.resolve(this.resolve(fleck)));
        allowlist.push(`${fleck}$`);
        config.resolve.alias
          .set(`${fleck}$`, alias);
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
        const configFile = this.localConfig(
          'babel.config.js',
          '@flecks/core',
          {root: resolved},
        );
        compileLoader({
          include: [sourcepath],
          babel: {configFile},
          ruleId: `@flecks/${runtime}/runtime/compile[${root}]`,
        })(neutrino);
      });
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
