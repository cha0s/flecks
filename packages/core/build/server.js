const {realpath} = require('fs/promises');
const {join} = require('path');

const babelmerge = require('babel-merge');
const set = require('lodash.set');

const D = require('./debug');
const explicate = require('./explicate');
const {Flecks} = require('./flecks');
const loadConfig = require('./load-config');
const Resolver = require('./resolver');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const debug = D('@flecks/core/build/bootstrap');
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
            set(config, [fleck, ...path], JSON.parse(jsonOrString));
            debug('read (%s) as JSON', jsonOrString);
          }
          catch (error) {
            set(config, [fleck, ...path], jsonOrString);
            debug('read (%s) as string', jsonOrString);
          }
        });
    });
  return config;
}

module.exports = class Server extends Flecks {

  buildConfigs = {};

  platforms = ['server'];

  resolved = {};

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
    const resolved = {};
    await Promise.all(
      Object.entries(explication.descriptors)
        .map(async ([, {path, request}]) => {
          try {
            if (path !== request || request !== await realpath(request)) {
              resolved[path] = request;
            }
          }
          // eslint-disable-next-line no-empty
          catch (error) {}
        }),
    );
    const reverseRequest = Object.fromEntries(
      Object.entries(explication.descriptors)
        .map(([, {path, request}]) => [request, path]),
    );
    return {
      resolved,
      resolver,
      roots: Object.fromEntries(
        Object.entries(explication.roots)
          .map(([request, bootstrap]) => [reverseRequest[request], {bootstrap, request}]),
      ),
      runtime,
    };
  }

  get extensions() {
    return this.invokeFlat('@flecks/core.exts').flat();
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
      resolved,
      resolver,
      roots,
      runtime,
    } = await this.buildRuntime(originalConfig, platforms, configFlecks);
    const flecks = super.from(runtime);
    flecks.roots = roots;
    flecks.platforms = platforms;
    flecks.resolved = resolved;
    flecks.resolver = resolver;
    flecks.loadBuildConfigs();
    return flecks;
  }

  loadBuildConfigs() {
    Object.entries(this.invoke('@flecks/core.build.config'))
      .forEach(([fleck, configs]) => {
        configs.forEach((config) => {
          this.buildConfigs[config] = fleck;
        });
      });
    debugSilly('build configs loaded: %O', this.buildConfigs);
  }

  async resolveBuildConfig(config, override) {
    const fleck = this.buildConfigs[config];
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
    // Compile.
    const needCompilation = Object.entries(this.resolved);
    if (needCompilation.length > 0) {
      const babelConfig = await this.babel();
      // const flecksBabelConfig = this.babel();
      // Alias and de-externalize.
      await Promise.all(
        needCompilation
          .map(async ([fleck, resolved]) => {
            allowlist.push(fleck);
            // Create alias.
            config.resolve.alias[fleck] = resolved;
            debugSilly('%s runtime de-externalized %s, alias: %s', runtime, fleck, resolved);
            // Alias this compiled fleck's `node_modules` to the root `node_modules`.
            config.resolve.alias[
              join(resolved, 'node_modules')
            ] = join(FLECKS_CORE_ROOT, 'node_modules');
            config.module.rules.push(
              {
                test: /\.(m?jsx?)?$/,
                include: [resolved],
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
          }),
      );
      // Our very own lil' chunk.
      set(config, 'optimization.splitChunks.cacheGroups.flecks-compiled', {
        chunks: 'all',
        enforce: true,
        priority: 100,
        test: new RegExp(
          `(?:${
            Object.keys(this.resolved)
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
    const targets = this.invoke('@flecks/core.targets');
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
      throw new Error(`@flecks/core.targets:\n${errorMessage}`);
    }
    this.invoke('@flecks/core.targets.alter', set);
    return entries
      .map(([fleck, targets]) => (
        targets
          .filter((target) => set.has(target))
          .map((target) => [fleck, target])
      )).flat();
  }

};
