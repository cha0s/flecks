const {realpath} = require('fs/promises');
const {dirname, join} = require('path');

const D = require('@flecks/core/build/debug');
const {Flecks} = require('@flecks/core/build/flecks');
const babelmerge = require('babel-merge');

const explicate = require('./explicate');
const loadConfig = require('./load-config');
const Resolver = require('./resolver');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const debug = D('@flecks/build/build/build');
const debugSilly = debug.extend('silly');

function environmentalize(path) {
  return path
    // - `@flecks/core` -> `flecks_core`
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_*(.*)_*/, '$1');
}

function environmentConfiguration(config) {
  const keys = Object.keys(process.env);
  Object.keys(config)
    .sort((l, r) => (l < r ? 1 : -1))
    .forEach((fleck) => {
      const prefix = `FLECKS_ENV__${environmentalize(fleck)}`;
      keys
        .filter((key) => key.startsWith(`${prefix}__`))
        .map((key) => {
          debug('reading environment from %s...', key);
          return [key.slice(prefix.length + 2), process.env[key]];
        })
        .map(([subkey, value]) => [subkey.split('_'), value])
        .forEach(([path, jsonOrString]) => {
          try {
            Flecks.set(config, [fleck, ...path], JSON.parse(jsonOrString));
            debug('read (%s) as JSON', jsonOrString);
          }
          catch (error) {
            Flecks.set(config, [fleck, ...path], jsonOrString);
            debug('read (%s) as string', jsonOrString);
          }
        });
    });
  return config;
}

module.exports = class Build extends Flecks {

  aliased = {};

  buildFiles = {};

  platforms = ['server'];

  compiled = {};

  resolver = new Resolver();

  roots = {};

  async babel() {
    const merging = [
      {
        plugins: ['@babel/plugin-syntax-dynamic-import'],
        presets: [
          [
            '@babel/preset-env',
            {
              shippedProposals: true,
              targets: {
                esmodules: true,
                node: 'current',
              },
            },
          ],
        ],
      },
    ];
    merging.push({configFile: await this.resolveBuildConfig('babel.config.js')});
    merging.push(...this.invokeFlat('@flecks/core.babel'));
    return babelmerge.all(merging);
  }

  static async buildRuntime(originalConfig, platforms, flecks = {}) {
    const dealiasedConfig = Object.fromEntries(
      Object.entries(originalConfig)
        .map(([maybeAliasedPath, config]) => {
          const index = maybeAliasedPath.indexOf(':');
          return [
            -1 === index ? maybeAliasedPath : maybeAliasedPath.slice(0, index),
            config,
          ];
        }),
    );
    const resolver = new Resolver();
    const explication = await explicate(
      Object.keys(originalConfig),
      {
        platforms,
        resolver,
        root: FLECKS_CORE_ROOT,
        importer: (request) => require(request),
      },
    );
    const runtime = {
      config: environmentConfiguration(
        Object.fromEntries(
          Object.values(explication.descriptors)
            .map(({path}) => [path, dealiasedConfig[path] || {}]),
        ),
      ),
      flecks: Object.fromEntries(
        Object.values(explication.descriptors)
          .map(({path, request}) => [path, flecks[path] || explication.roots[request] || {}]),
      ),
    };
    const aliased = {};
    const compiled = {};
    const reverseRequest = Object.fromEntries(
      Object.entries(explication.descriptors)
        .map(([, {path, request}]) => [request, path]),
    );
    const roots = Object.fromEntries(
      (await Promise.all(Object.entries(explication.roots)
        .map(async ([request, bootstrap]) => {
          const packageRequest = await realpath(await resolver.resolve(join(request, 'package.json')));
          const realDirname = dirname(packageRequest);
          const {dependencies = {}, devDependencies = {}} = require(packageRequest);
          let source;
          let root;
          // One of ours?
          if (
            [].concat(
              Object.keys(dependencies),
              Object.keys(devDependencies),
            )
              .includes('@flecks/fleck')
          ) {
            root = realDirname.endsWith('/dist') ? realDirname.slice(0, -5) : realDirname;
            source = join(root, 'src');
          }
          else {
            root = realDirname;
            source = realDirname;
          }
          return [
            reverseRequest[request],
            {
              bootstrap,
              request,
              root,
              source,
            },
          ];
        })))
        // Reverse sort for greedy root matching.
        .sort(([l], [r]) => (l < r ? 1 : -1)),
    );
    await Promise.all(
      Object.entries(explication.descriptors)
        .map(async ([, {path, request}]) => {
          if (path !== request) {
            aliased[path] = request;
          }
          const [root, requestRoot] = Object.entries(roots)
            .find(([, {request: rootRequest}]) => request.startsWith(rootRequest)) || [];
          if (requestRoot && compiled[requestRoot.root]) {
            return;
          }
          let resolvedRequest = await resolver.resolve(request);
          if (!resolvedRequest) {
            if (!requestRoot) {
              return;
            }
            resolvedRequest = await resolver.resolve(join(requestRoot.root, 'package.json'));
          }
          const realResolvedRequest = await realpath(resolvedRequest);
          if (path !== request || resolvedRequest !== realResolvedRequest) {
            if (requestRoot) {
              if (!compiled[requestRoot.root]) {
                compiled[requestRoot.root] = {
                  flecks: [],
                  path: root,
                  root: requestRoot.root,
                  source: requestRoot.source,
                };
              }
              compiled[requestRoot.root].flecks.push(path);
            }
          }
        }),
    );
    return {
      aliased,
      compiled,
      resolver,
      roots,
      runtime,
    };
  }

  static async from(
    {
      config: configParameter,
      flecks: configFlecks,
      platforms = ['server'],
    } = {},
  ) {
    // Load or use parameterized configuration.
    let originalConfig;
    let configType = 'parameter';
    if (!configParameter) {
      // eslint-disable-next-line no-param-reassign
      [configType, originalConfig] = await loadConfig();
    }
    else {
      originalConfig = JSON.parse(JSON.stringify(configParameter));
    }
    debug('bootstrap configuration (%s)', configType);
    debugSilly(originalConfig);
    const {
      aliased,
      compiled,
      resolver,
      roots,
      runtime,
    } = await this.buildRuntime(originalConfig, platforms, configFlecks);
    const flecks = super.from(runtime);
    flecks.aliased = aliased;
    flecks.compiled = compiled;
    flecks.platforms = platforms;
    flecks.roots = roots;
    flecks.resolver = resolver;
    flecks.loadBuildConfigs();
    return flecks;
  }

  loadBuildConfigs() {
    Object.entries(this.invoke('@flecks/build.files'))
      .forEach(([fleck, configs]) => {
        configs.forEach((config) => {
          this.buildFiles[config] = fleck;
        });
      });
    debugSilly('build configs loaded: %O', this.buildFiles);
  }

  get realiasedConfig() {
    return Object.fromEntries(
      Object.entries(this.config)
        .map(([path, config]) => {
          const alias = this.aliased[path];
          return [alias ? `${path}:${alias}` : path, config];
        }),
    );
  }

  async resolveBuildConfig(config, override) {
    const fleck = this.buildFiles[config];
    if (!fleck) {
      throw new Error(`Unknown build config: '${config}'`);
    }
    const rootConfig = await this.resolver.resolve(join(FLECKS_CORE_ROOT, 'build', config));
    if (rootConfig) {
      return rootConfig;
    }
    if (override) {
      const overrideConfig = await this.resolver.resolve(join(override, 'build', config));
      if (overrideConfig) {
        return overrideConfig;
      }
    }
    return this.resolver.resolve(join(fleck, 'build', config));
  }

  async runtimeCompiler(runtime, config, {allowlist = []} = {}) {
    // Compile?
    const needCompilation = Object.entries(this.compiled);
    if (needCompilation.length > 0) {
      const babelConfig = await this.babel();
      const includes = [];
      // Alias and de-externalize.
      await Promise.all(
        needCompilation
          .map(async ([
            root,
            {
              path,
              source,
            },
          ]) => {
            allowlist.push(new RegExp(`^${path}`));
            debugSilly('%s runtime de-externalized %s, alias: %s', runtime, root, source || path);
            // Alias.
            config.resolve.alias[path] = source || path;
            // Root aliases.
            if (root) {
              config.resolve.alias[
                join(root, 'node_modules')
              ] = join(FLECKS_CORE_ROOT, 'node_modules');
              config.resolve.fallback[path] = root;
            }
            includes.push(root || path);
          }),
      );
      // Compile.
      config.module.rules.push(
        {
          test: /\.(m?jsx?)?$/,
          include: includes,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                cacheDirectory: true,
                babelrc: false,
                configFile: false,
                ...babelConfig,
              },
            },
          ],
        },
      );
      // Aliases.
      Object.entries(this.aliased)
        .forEach(([from, to]) => {
          if (
            !Object.entries(this.compiled)
              .some(([, {flecks}]) => flecks.includes(from))
          ) {
            config.resolve.alias[from] = to;
          }
        });
      // Our very own lil' chunk.
      Flecks.set(config, 'optimization.splitChunks.cacheGroups.flecks-compiled', {
        chunks: 'all',
        enforce: true,
        priority: 100,
        test: new RegExp(
          `(?:${
            includes
              .map((path) => path.replace(/[\\/]/g, '[\\/]')).join('|')
          })`,
        ),
      });
    }
  }

  get stubs() {
    return Object.values(this.flecks)
      .reduce(
        (r, {stubs = {}}) => (
          r.concat(
            Object.entries(stubs)
              .reduce(
                (r, [platform, stubs]) => (
                  r.concat(this.platforms.includes(platform) ? stubs : [])
                ),
                [],
              ),
          )
        ),
        [],
      ).flat();
  }

  get targets() {
    const targets = this.invoke('@flecks/build.targets');
    const duplicates = {};
    const entries = Object.entries(targets);
    const set = new Set();
    entries
      .forEach(([fleck, targets]) => {
        targets.forEach((target) => {
          if (set.has(target)) {
            if (!duplicates[target]) {
              duplicates[target] = [];
            }
            duplicates[target].push(fleck);
          }
          set.add(target);
        });
      });
    const errorMessage = Object.entries(duplicates).map(([target, flecks]) => (
      `Multiple flecks ('${flecks.join("', '")})' tried to build target '${target}'`
    )).join('\n');
    if (errorMessage) {
      throw new Error(`@flecks/build.targets:\n${errorMessage}`);
    }
    this.invoke('@flecks/build.targets.alter', set);
    return entries
      .map(([fleck, targets]) => (
        targets
          .filter((target) => set.has(target))
          .map((target) => [fleck, target])
      )).flat();
  }

};
