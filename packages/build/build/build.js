const {addHook} = require('pirates');
// Hack in `require.context`.
addHook(
  (code) => (
    code.replaceAll('require.context', "require('@flecks/core/build/flecks').Flecks.context")
  ),
  {
    exts: ['.js'],
    ignoreNodeModules: false,
    matcher: (request) => request.match(/flecks\.bootstrap\.js$/),
  },
);

const {join} = require('path');

const D = require('@flecks/core/build/debug');
const {Flecks} = require('@flecks/core/build/flecks');
const babelmerge = require('babel-merge');

const explicate = require('./explicate');
const loadConfig = require('./load-config');
const Resolver = require('./resolver');

const {
  FLECKS_CORE_BUILD_LIST = '',
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const debug = D('@flecks/build/build/build');
const debugSilly = debug.extend('silly');

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

  static get buildList() {
    return FLECKS_CORE_BUILD_LIST
      .split(',')
      .map((name) => name.trim())
      .filter((e) => e);
  }

  static async buildRuntime({
    flecks = {},
    originalConfig,
    platforms,
    root,
  }) {
    const cleanConfig = JSON.parse(JSON.stringify(originalConfig));
    // Dealias the config keys.
    const dealiasedConfig = this.dealiasedConfig(cleanConfig);
    const resolver = new Resolver({root});
    const {paths, roots} = await explicate({
      paths: Object.keys(originalConfig),
      platforms,
      resolver,
      importer: (request) => require(request),
    });
    const runtime = {
      config: this.environmentConfiguration(
        paths,
        Object.fromEntries(paths.map((path) => [path, dealiasedConfig[path] || {}])),
      ),
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
      root = FLECKS_CORE_ROOT,
    } = {},
  ) {
    // Load or use parameterized configuration.
    let originalConfig;
    let configType = 'parameter';
    if (!configParameter) {
      // eslint-disable-next-line no-param-reassign
      [configType, originalConfig] = await loadConfig(root);
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
    } = await this.buildRuntime({
      flecks: configFlecks,
      originalConfig,
      platforms,
      root,
    });
    const flecks = await super.from(runtime);
    flecks.platforms = platforms;
    flecks.root = root;
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
    const rootConfig = await this.resolver.resolve(join(this.root, 'build', config));
    if (rootConfig) {
      debugSilly("resolved '%s' to '%s'", config, rootConfig);
      return rootConfig;
    }
    if (override) {
      const overrideConfig = await this.resolver.resolve(join(override, 'build', config));
      if (overrideConfig) {
        debugSilly("resolved '%s' to '%s'", config, overrideConfig);
        return overrideConfig;
      }
    }
    const fleckConfig = await this.resolver.resolve(join(fleck, 'build', config));
    if (fleckConfig) {
      debugSilly("resolved '%s' to '%s'", config, fleckConfig);
    }
    else {
      throw new Error(`couldn't resolve '${config}'`);
    }
    return fleckConfig;
  }

  async runtimeCompiler(runtime, config, env, argv) {
    if ('production' !== argv.mode) {
      config.module.rules.push(
        {
          test: /\.ya?ml$/,
          use: 'yaml-loader',
        },
      );
    }
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
      // @todo this breaks context, investigate
      // Flecks.set(config, 'optimization.splitChunks.cacheGroups.flecks-compiled', {
      //   chunks: 'all',
      //   enforce: true,
      //   priority: 100,
      //   test: new RegExp(`(?:${
      //     include.map((path) => path.replace(/[\\/]/g, '[\\/]')).join('|')
      //   })`),
      // });
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
