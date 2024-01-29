const {join} = require('path');

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
    return babelmerge.all([
      {configFile: await this.resolveBuildConfig('babel.config.js')},
      ...await this.invokeSequentialAsync('@flecks/core.babel'),
    ]);
  }

  static async buildRuntime(originalConfig, platforms, flecks = {}) {
    const cleanConfig = JSON.parse(JSON.stringify(originalConfig));
    // Dealias the config keys.
    const dealiasedConfig = environmentConfiguration(
      Object.fromEntries(
        Object.entries(cleanConfig)
          .map(([maybeAliasedPath, config]) => {
            const index = maybeAliasedPath.indexOf(':');
            return [
              -1 === index ? maybeAliasedPath : maybeAliasedPath.slice(0, index),
              config,
            ];
          }),
      ),
    );
    const resolver = new Resolver({root: FLECKS_CORE_ROOT});
    const {paths, roots} = await explicate({
      paths: Object.keys(originalConfig),
      platforms,
      resolver,
      importer: (request) => require(request),
    });
    const runtime = {
      config: Object.fromEntries(paths.map((path) => [path, dealiasedConfig[path] || {}])),
      flecks: Object.fromEntries(paths.map((path) => [
        path,
        flecks[path] || roots[path]?.bootstrap || {},
      ])),
    };
    return {
      resolver,
      roots: Object.entries(roots).map(([path, {request}]) => [path, request]),
      runtime,
    };
  }

  async configureBuilds(config, env, argv) {
    await Promise.all(
      Object.entries(config)
        .map(([target, config]) => (
          this.invokeSequentialAsync('@flecks/build.config', target, config, env, argv)
        )),
    );
    await this.invokeSequentialAsync('@flecks/build.config.alter', config, env, argv);
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
      resolver,
      roots,
      runtime,
    } = await this.buildRuntime(originalConfig, platforms, configFlecks);
    const flecks = await super.from(runtime);
    flecks.platforms = platforms;
    flecks.roots = roots;
    flecks.resolver = resolver;
    flecks.loadBuildFiles();
    return flecks;
  }

  loadBuildFiles() {
    Object.entries(this.invoke('@flecks/build.files'))
      .forEach(([fleck, filenames]) => {
        filenames.forEach((filename) => {
          this.buildFiles[filename] = fleck;
        });
      });
    debugSilly('build files loaded: %O', this.buildFiles);
  }

  get realiasedConfig() {
    return Object.fromEntries(
      Object.entries(this.config)
        .map(([path, config]) => {
          const alias = this.resolver.fallbacks[path];
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

  async runtimeCompiler(runtime, config) {
    // Compile?
    const compiled = this.roots.filter(([path, request]) => path !== request);
    if (compiled.length > 0) {
      const include = Object.values(this.resolver.aliases);
      config.module.rules.push(
        {
          test: /\.(m?jsx?)?$/,
          include,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                cacheDirectory: true,
                babelrc: false,
                configFile: false,
                ...await this.babel(),
              },
            },
          ],
        },
      );
      // Our very own lil' chunk.
      Flecks.set(config, 'optimization.splitChunks.cacheGroups.flecks-compiled', {
        chunks: 'all',
        enforce: true,
        priority: 100,
        test: new RegExp(`(?:${
          include.map((path) => path.replace(/[\\/]/g, '[\\/]')).join('|')
        })`),
      });
    }
    // Resolution.
    const {resolve, resolveLoader} = config;
    resolve.alias = {...resolve.alias, ...this.resolver.aliases};
    resolve.fallback = {...resolve.fallback, ...this.resolver.fallbacks};
    resolve.modules = [...resolve.modules, ...this.resolver.modules];
    resolveLoader.alias = {...resolveLoader.alias, ...this.resolver.aliases};
    resolveLoader.fallback = {...resolveLoader.fallback, ...this.resolver.fallbacks};
    resolveLoader.modules = [...resolveLoader.modules, ...this.resolver.modules];
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
