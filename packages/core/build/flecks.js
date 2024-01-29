// eslint-disable-next-line max-classes-per-file
const {
  basename,
  dirname,
  extname,
  join,
} = require('path');

const get = require('lodash.get');
const set = require('lodash.set');

const compose = require('./compose');
const D = require('./debug');
const Digraph = require('./digraph');
const Middleware = require('./middleware');

const debug = D('@flecks/core/flecks');
const debugSilly = debug.extend('silly');

// Symbol for hook ordering.
const HookPriority = Symbol.for('@flecks/core.hookPriority');

// Symbols for Gathered classes.
exports.ById = Symbol.for('@flecks/core.byId');
exports.ByType = Symbol.for('@flecks/core.byType');

/**
 * Capitalize a string.
 *
 * @param {string} string
 * @returns {string}
 */
const capitalize = (string) => string.substring(0, 1).toUpperCase() + string.substring(1);

/**
 * CamelCase a string.
 *
 * @param {string} string
 * @returns {string}
 */
const camelCase = (string) => string.split(/[_-]/).map(capitalize).join('');

// Wrap classes to expose their flecks ID and type.
const wrapGathered = (Class, id, idProperty, type, typeProperty) => {
  class Subclass extends Class {

    static get [idProperty]() {
      return id;
    }

    static get [typeProperty]() {
      return type;
    }

  }
  return Subclass;
};

exports.Flecks = class Flecks {

  config = {};

  $$expandedFlecksCache = {};

  flecks = {};

  $$gathered = {};

  hooks = {};

  /**
   * @param {object} runtime
   * @param {object} runtime.config configuration (e.g. loaded from `flecks.yml`).
   * @param {object} runtime.flecks fleck modules.
   */
  constructor({
    config = {},
    flecks = {},
  } = {}) {
    const emptyConfigForAllFlecks = Object.fromEntries(
      Object.keys(flecks).map((path) => [path, {}]),
    );
    this.config = {...emptyConfigForAllFlecks, ...config};
    const entries = Object.entries(flecks);
    debugSilly('paths: %O', entries.map(([fleck]) => fleck));
    for (let i = 0; i < entries.length; i++) {
      const [fleck, M] = entries[i];
      this.registerFleckHooks(fleck, M);
      this.invoke('@flecks/core.registered', fleck, M);
    }
    this.configureFlecksDefaults();
    debugSilly('config: %O', this.config);
  }

  /**
   * Configure defaults for a fleck.
   *
   * @param {string} fleck
   * @protected
   */
  configureFleckDefaults(fleck) {
    this.config[fleck] = {
      ...this.invokeFleck('@flecks/core.config', fleck),
      ...this.config[fleck],
    };
  }

  /**
   * Configure defaults for all flecks.
   *
   * @protected
   */
  configureFlecksDefaults() {
    const flecks = this.flecksImplementing('@flecks/core.config');
    for (let i = 0; i < flecks.length; i++) {
      this.configureFleckDefaults(flecks[i]);
    }
  }

  /**
   * [Dasherize]{@link https://en.wiktionary.org/wiki/dasherize} a fleck path.
   *
   * @param {string} path The path to dasherize.
   * @returns {string}
   */
  static dasherizePath(path) {
    const parts = dirname(path).split('/');
    if ('.' === parts[0]) {
      parts.shift();
    }
    if ('index' === parts[parts.length - 1]) {
      parts.pop();
    }
    return join(parts.join('-'), basename(path, extname(path)));
  }

  /**
   * Generate a decorator from a require context.
   *
   * @param {*} context @see {@link https://webpack.js.org/guides/dependency-management/#requirecontext}
   * @param {object} config
   * @param {function} [config.transformer = {@link camelCase}]
   *   Function to run on each context path.
   * @returns {function} The decorator.
   */
  static decorate(
    context,
    {
      transformer = camelCase,
    } = {},
  ) {
    return (Gathered, flecks) => (
      context.keys()
        .reduce(
          (Gathered, path) => {
            const key = transformer(this.dasherizePath(path));
            if (!Gathered[key]) {
              return Gathered;
            }
            const {default: M} = context(path);
            if ('function' !== typeof M) {
              throw new ReferenceError(
                `Flecks.decorate(): require(${path}).default is not a function (from: ${context.id})`,
              );
            }
            return {...Gathered, [key]: M(Gathered[key], flecks)};
          },
          Gathered,
        )
    );
  }

  async checkAndDecorateRawGathered(hook, raw, check) {
    // Gather classes and check.
    check(raw, hook);
    // Decorate and check.
    const decorated = await this.invokeComposedAsync(`${hook}.decorate`, raw);
    check(decorated, `${hook}.decorate`);
    return decorated;
  }

  /**
   * Destroy this instance.
   */
  destroy() {
    this.$$expandedFlecksCache = {};
    this.config = {};
    this.$$gathered = {};
    this.hooks = {};
    this.flecks = {};
  }

  /**
   * Lists all flecks implementing a hook, including platform-specific and elided variants.
   *
   * @param {string} hook
   * @returns {string[]} The expanded list of flecks.
   */
  expandedFlecks(hook) {
    if (this.$$expandedFlecksCache[hook]) {
      return [...this.$$expandedFlecksCache[hook]];
    }
    const flecks = this.lookupFlecks(hook);
    let expanded = [];
    for (let i = 0; i < flecks.length; ++i) {
      const fleck = flecks[i];
      expanded.push(fleck);
    }
    // Handle elision.
    const index = expanded.findIndex((fleck) => '...' === fleck);
    if (-1 !== index) {
      if (-1 !== expanded.slice(index + 1).findIndex((fleck) => '...' === fleck)) {
        throw new Error(
          `Illegal ordering specification: hook '${hook}' has multiple ellipses.`,
        );
      }
      // Split at the elision point and remove the ellipses.
      const before = expanded.slice(0, index);
      const after = expanded.slice(index + 1);
      expanded.splice(index, 1);
      // Expand elided flecks.
      const elided = [];
      const implementing = this.flecksImplementing(hook);
      for (let i = 0; i < implementing.length; ++i) {
        const fleck = implementing[i];
        if (!expanded.includes(fleck)) {
          elided.push(fleck);
        }
      }
      // Map the fleck implementations to vertices in a dependency graph.
      const graph = this.flecksHookGraph([...before, ...elided, ...after], hook);
      // Check for cycles.
      const cycles = graph.detectCycles();
      if (cycles.length > 0) {
        throw new Error(
          `Illegal ordering specification: hook '${
            hook
          }' has positioning cycles: ${
            cycles.map(([l, r]) => `${l} <-> ${r}`).join(', ')
          }`,
        );
      }
      // Sort the graph.
      expanded = [
        ...before,
        ...graph.sort().filter((fleck) => !expanded.includes(fleck)),
        ...after,
      ];
    }
    // Build another graph, but add dependencies connecting the final ordering. If cycles exist,
    // the ordering violated the expectation of one or more implementations.
    const graph = this.flecksHookGraph(expanded, hook);
    expanded.forEach((fleck, i) => {
      if (i < expanded.length - 1) {
        graph.addDependency(expanded[i + 1], fleck);
      }
    });
    const cycles = graph.detectCycles();
    if (cycles.length > 0) {
      cycles.forEach(([l, r]) => {
        const lImplementation = this.fleckImplementation(l, hook);
        const {before: lBefore = [], after: lAfter = []} = lImplementation?.[HookPriority] || {};
        const explanation = [hook];
        if (lBefore.includes(r)) {
          explanation.push(l, 'before', r);
        }
        if (lAfter.includes(r)) {
          explanation.push(l, 'after', r);
        }
        const rImplementation = this.fleckImplementation(r, hook);
        const {before: rBefore = [], after: rAfter = []} = rImplementation?.[HookPriority] || {};
        if (rBefore.includes(l)) {
          explanation.push(r, 'before', l);
        }
        if (rAfter.includes(l)) {
          explanation.push(r, 'after', l);
        }
        debug(
          "Suspicious ordering specification for '%s': '%s' expected to run %s '%s'!",
          ...explanation,
        );
      });
    }
    // Filter unimplemented.
    this.$$expandedFlecksCache[hook] = expanded // eslint-disable-line no-return-assign
      .filter((fleck) => this.fleckImplementation(fleck, hook));
    debugSilly("cached hook expansion for '%s': %O", hook, expanded);
    return [...this.$$expandedFlecksCache[hook]];
  }

  /**
   * Get the module for a fleck.
   *
   * @param {*} fleck
   *
   * @returns {*}
   */
  fleck(fleck) {
    return this.flecks[fleck];
  }

  /**
   * Get a fleck's implementation of a hook.
   *
   * @param {*} fleck
   * @param {string} hook
   * @returns {boolean}
   */
  fleckImplementation(fleck, hook) {
    if (!this.hooks[hook]) {
      return undefined;
    }
    const found = this.hooks[hook]?.find(({fleck: candidate}) => fleck === candidate);
    if (!found) {
      return undefined;
    }
    return found.fn;
  }

  /**
   * Get a list of flecks implementing a hook.
   *
   * @param {string} hook
   * @returns {string[]}
   */
  flecksImplementing(hook) {
    return this.hooks[hook]?.map(({fleck}) => fleck) || [];
  }

  /**
   * Create a dependency graph from a list of flecks.
   * @param {string[]} flecks
   * @param {string} hook
   * @returns {Digraph} graph
   */
  flecksHookGraph(flecks, hook) {
    const graph = new Digraph();
    flecks
      .forEach((fleck) => {
        graph.ensureTail(fleck);
        const implementation = this.fleckImplementation(fleck, hook);
        if (implementation?.[HookPriority]) {
          if (implementation[HookPriority].before) {
            implementation[HookPriority].before.forEach((before) => {
              graph.addDependency(before, fleck);
            });
          }
          if (implementation[HookPriority].after) {
            implementation[HookPriority].after.forEach((after) => {
              graph.addDependency(fleck, after);
            });
          }
        }
      });
    this.invoke('@flecks/core.priority', graph, hook);
    return graph;
  }

  /**
   * Create a mixed instance of flecks.
   * @param {Object} config Configuration.
   * @returns {Flecks} A flecks instance.
   */
  static async from(runtime) {
    const {flecks} = runtime;
    const mixinDescription = Object.entries(flecks)
      .map(([path, {mixin}]) => [path, mixin]).filter(([, mixin]) => mixin);
    debugSilly('mixins: %O', mixinDescription.map(([path]) => path));
    const Flecks = compose(...mixinDescription.map(([, mixin]) => mixin))(this);
    const instance = new Flecks(runtime);
    await instance.gatherHooks();
    await instance.invokeSequentialAsync('@flecks/core.starting');
    return instance;
  }

  /**
   * Gather and register class types.
   *
   * @param {string} hook
   * @param {object} config
   * @param {string} [config.idProperty='id'] The property used to get/set the class ID.
   * @param {string} [config.typeProperty='type'] The property used to get/set the class type.
   * @param {function} [config.check=() => {}] Check the validity of the gathered classes.
   * @returns {object} An object with keys for ID, type, {@link ById}, and {@link ByType}.
   */
  async gather(
    hook,
    {
      idProperty = 'id',
      typeProperty = 'type',
      check = () => {},
    } = {},
  ) {
    if (!hook || 'string' !== typeof hook) {
      throw new TypeError('Flecks.gather(): Expects parameter 1 (hook) to be string');
    }
    // Gather classes and check.
    const raw = await this.invokeMergeAsync(hook);
    const decorated = await this.checkAndDecorateRawGathered(hook, raw, check);
    // Assign unique IDs to each class and sort by type.
    let uid = 1;
    const ids = {};
    const types = (
      Object.fromEntries(
        Object.entries(decorated)
          .sort(([ltype], [rtype]) => (ltype < rtype ? -1 : 1))
          .map(([type, Class]) => {
            const id = uid++;
            ids[id] = wrapGathered(Class, id, idProperty, type, typeProperty);
            return [type, ids[id]];
          }),
      )
    );
    // Conglomerate all ID and type keys along with Symbols for accessing either/or.
    const gathered = {
      ...ids,
      ...types,
      [exports.ById]: ids,
      [exports.ByType]: types,
    };
    this.$$gathered[hook] = {
      check,
      idProperty,
      typeProperty,
      gathered,
    };
    debug("gathered '%s': %O", hook, Object.keys(gathered[exports.ByType]));
    return gathered;
  }

  gathered(type) {
    return this.$$gathered[type]?.gathered;
  }

  async gatherHooks() {
    const gathering = await this.invokeAsync('@flecks/core.gathered');
    await Promise.all(
      Object.entries(gathering)
        .map(([fleck, gathering]) => (
          Promise.all(
            Object.entries(gathering)
              .map(([type, options]) => (
                this.gather(`${fleck}.${type}`, options)
              )),
          )
        )),
    );
  }

  /**
   * Get a configuration value.
   *
   * @param {string} path The configuration path e.g. `@flecks/example.config`.
   * @param {*} defaultValue The default value if no configuration value is found.
   * @returns {*}
   */
  get(path, defaultValue) {
    return get(this.config, path, defaultValue);
  }

  /**
   * Interpolate a string with flecks configurtaion values.
   * @param {string} string
   * @returns The interpolated string.
   */
  interpolate(string) {
    return string.replace(/\[(.*?)\]/g, (match) => this.get(match));
  }

  /**
   * Return an object whose keys are fleck paths and values are the result of invoking the hook.
   * @param {string} hook
   * @param {...any} args Arguments passed to each implementation.
   * @returns {*}
   */
  invoke(hook, ...args) {
    if (!this.hooks[hook]) {
      return {};
    }
    return this.flecksImplementing(hook)
      .reduce((r, fleck) => ({...r, [fleck]: this.invokeFleck(hook, fleck, ...args)}), {});
  }

  /**
   * Return an object whose keys are fleck paths and values are the `await`ed result of invoking
   * the hook.
   * @param {string} hook
   * @param {...any} args Arguments passed to each implementation.
   * @returns {*}
   */
  async invokeAsync(hook, ...args) {
    if (!this.hooks[hook]) {
      return {};
    }
    return this.flecksImplementing(hook)
      .reduce(
        async (r, fleck) => ({
          ...(await r),
          [fleck]: await this.invokeFleck(hook, fleck, ...args),
        }),
        {},
      );
  }

  /**
   * See: [function composition](https://www.educative.io/edpresso/function-composition-in-javascript).
   *
   * @configurable
   * @param {string} hook
   * @param {*} initial The initial value passed to the composition chain.
   * @param  {...any} args The arguments passed after the accumulator to each implementation.
   * @returns {*} The final composed value.
   */
  invokeComposed(hook, initial, ...args) {
    if (!this.hooks[hook]) {
      return initial;
    }
    const flecks = this.expandedFlecks(hook);
    return flecks
      .reduce((r, fleck) => this.invokeFleck(hook, fleck, r, ...args), initial);
  }

  /**
   * An async version of `invokeComposed`.
   *
   * @see {@link Flecks#invokeComposed}
   */
  async invokeComposedAsync(hook, arg, ...args) {
    if (!this.hooks[hook]) {
      return arg;
    }
    const flecks = this.expandedFlecks(hook);
    return flecks
      .reduce(async (r, fleck) => this.invokeFleck(hook, fleck, await r, ...args), arg);
  }

  /**
   * Invokes a hook and returns a flat array of results.
   *
   * @param {string} hook
   * @param  {...any} args The arguments passed to each implementation.
   * @returns {any[]}
   */
  invokeFlat(hook, ...args) {
    if (!this.hooks[hook]) {
      return [];
    }
    return this.hooks[hook].map(({fleck}) => this.invokeFleck(hook, fleck, ...args));
  }

  /**
   * Invokes a hook on a single fleck.
   *
   * @param {string} hook
   * @param {*} fleck
   * @param  {...any} args
   * @returns {*}
   */
  invokeFleck(hook, fleck, ...args) {
    debugSilly('invokeFleck(%s, %s, ...)', hook, fleck);
    if (!this.hooks[hook]) {
      return undefined;
    }
    const candidate = this.hooks[hook]
      .find(({fleck: candidate}) => candidate === fleck);
    if (!candidate) {
      return undefined;
    }
    return candidate.fn(...(args.concat(this)));
  }

  static $$invokeMerge(r, o) {
    return {...r, ...o};
  }

  /**
   * Specialization of `invokeReduce`. Invokes a hook and reduces an object from all the resulting
   * objects.
   *
   * @param {string} hook
   * @param  {...any} args
   * @returns {object}
   */
  invokeMerge(hook, ...args) {
    return this.invokeReduce(hook, this.constructor.$$invokeMerge, {}, ...args);
  }

  /**
   * An async version of `invokeMerge`.
   *
   * @see {@link Flecks#invokeMerge}
   */
  async invokeMergeAsync(hook, ...args) {
    return this.invokeReduceAsync(hook, this.constructor.$$invokeMerge, {}, ...args);
  }

  static $$invokeMergeUnique() {
    const track = {};
    return (r, o, fleck, hook) => {
      const keys = Object.keys(o);
      for (let i = 0; i < keys.length; ++i) {
        const key = keys[i];
        if (track[key]) {
          throw new ReferenceError(
            `Conflict in ${hook}: '${track[key]}' implemented '${key}', followed by '${fleck}'`,
          );
        }
        track[key] = fleck;
      }
      return ({...r, ...o});
    };
  }

  /**
   * Specialization of `invokeMerge`. Invokes a hook and reduces an object from all the resulting
   * objects.
   *
   * @param {string} hook
   * @param  {...any} args
   * @returns {object}
   */
  invokeMergeUnique(hook, ...args) {
    return this.invokeReduce(hook, this.constructor.$$invokeMergeUnique(), {}, ...args);
  }

  /**
   * An async version of `invokeMergeUnique`.
   *
   * @see {@link Flecks#invokeMergeUnique}
   */
  async invokeMergeUniqueAsync(hook, ...args) {
    return this.invokeReduceAsync(hook, this.constructor.$$invokeMergeUnique(), {}, ...args);
  }

  /**
   * See: [Array.prototype.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)
   *
   * @param {string} hook
   * @param {*} reducer
   * @param {*} initial
   * @param  {...any} args The arguments passed after the accumulator to each implementation.
   * @returns {*}
   */
  invokeReduce(hook, reducer, initial, ...args) {
    if (!this.hooks[hook]) {
      return initial;
    }
    return this.hooks[hook]
      .reduce(
        (r, {fleck}) => reducer(r, this.invokeFleck(hook, fleck, ...args), fleck, hook),
        initial,
      );
  }

  /**
   * An async version of `invokeReduce`.
   *
   * @see {@link Flecks#invokeReduce}
   */
  async invokeReduceAsync(hook, reducer, initial, ...args) {
    if (!this.hooks[hook]) {
      return initial;
    }
    return this.hooks[hook]
      .reduce(
        async (r, {fleck}) => (
          reducer(await r, await this.invokeFleck(hook, fleck, ...args), fleck, hook)
        ),
        initial,
      );
  }

  /**
   * Invokes hooks on a fleck one after another. This is effectively a configurable version of
   * {@link Flecks#invokeFlat}.
   *
   * @configurable
   * @param {string} hook
   * @param  {...any} args The arguments passed to each implementation.
   * @returns {any[]}
   */
  invokeSequential(hook, ...args) {
    if (!this.hooks[hook]) {
      return [];
    }
    const results = [];
    const flecks = this.expandedFlecks(hook);
    while (flecks.length > 0) {
      const fleck = flecks.shift();
      results.push(this.invokeFleck(hook, fleck, ...args));
    }
    return results;
  }

  /**
   * An async version of `invokeSequential`.
   *
   * @see {@link Flecks#invokeSequential}
   */
  async invokeSequentialAsync(hook, ...args) {
    if (!this.hooks[hook]) {
      return [];
    }
    const results = [];
    const flecks = this.expandedFlecks(hook);
    while (flecks.length > 0) {
      const fleck = flecks.shift();
      // eslint-disable-next-line no-await-in-loop
      results.push(await this.invokeFleck(hook, fleck, ...args));
    }
    return results;
  }

  /**
   * Lookup flecks configured for a hook.
   *
   * If no configuration is found, defaults to ellipses.
   *
   * @param {string} hook
   * @example
   * # Given hook @flecks/example.hook, `flecks.yml` could be configured as such:
   * '@flecks/example':
   *   hook: ['...']
   * @returns {string[]}
   */
  lookupFlecks(hook) {
    const index = hook.indexOf('.');
    if (-1 === index) {
      return ['...'];
    }
    return this.get([hook.slice(0, index), hook.slice(index + 1)], ['...']);
  }

  /**
   * Make a middleware function from configured middleware.
   * @param {string} hook
   * @returns {function}
   */
  makeMiddleware(hook) {
    debugSilly('makeMiddleware(...): %s', hook);
    if (!this.hooks[hook]) {
      return (...args) => args.pop()();
    }
    const flecks = this.expandedFlecks(hook);
    if (0 === flecks.length) {
      // No flecks, immediate dispatch.
      return (...args) => args.pop()();
    }
    debugSilly('middleware: %O', flecks);
    const instance = new Middleware(flecks.map((fleck) => this.invokeFleck(hook, fleck)));
    return instance.dispatch.bind(instance);
  }

  /**
   * Scedule the priority of a hook implementation.
   *
   * @param {function} implementation
   * @param {object} schedule
   */
  static priority(implementation, schedule = {}) {
    const normalized = {};
    if (schedule.after) {
      normalized.after = Array.isArray(schedule.after) ? schedule.after : [schedule.after];
    }
    if (schedule.before) {
      normalized.before = Array.isArray(schedule.before) ? schedule.before : [schedule.before];
    }
    implementation[HookPriority] = normalized;
    return implementation;
  }

  /**
   * Provide classes for e.g. {@link Flecks#gather}
   *
   * @param {*} context @see {@link https://webpack.js.org/guides/dependency-management/#requirecontext}
   * @param {object} config
   * @param {function} [config.invoke = true] Invoke the default exports as a function?
   * @param {function} [config.transformer = {@link camelCase}]
   *   Function to run on each context path.
   * @returns {object}
   */
  static provide(
    context,
    {
      invoke = true,
      transformer = camelCase,
    } = {},
  ) {
    return (flecks) => (
      Object.fromEntries(
        context.keys()
          .map((path) => {
            const {default: M} = context(path);
            if (invoke && 'function' !== typeof M) {
              throw new ReferenceError(
                `Flecks.provide(): require(${
                  path
                }).default is not a function (from: ${
                  context.id
                })`,
              );
            }
            return [
              transformer(this.dasherizePath(path)),
              invoke ? M(flecks) : M,
            ];
          }),
      )
    );
  }

  /**
   * Refresh a fleck's hooks, configuration, and any gathered classes.
   *
   * @param {string} fleck
   * @param {object} M The fleck module
   * @protected
   */
  refresh(fleck, M) {
    debug('refreshing %s...', fleck);
    // Remove old hook implementations.
    this.unregisterFleckHooks(fleck);
    // Replace the fleck.
    this.registerFleckHooks(fleck, M);
    // Write config.
    this.configureFleckDefaults(fleck);
    // HMR.
    this.refreshGathered(fleck);
  }

  /**
   * Refresh gathered classes for a fleck.
   *
   * @param {string} fleck
   */
  async refreshGathered(fleck) {
    await Promise.all(
      Object.entries(this.$$gathered)
        .map(async ([
          hook,
          {
            check,
            idProperty,
            gathered,
            typeProperty,
          },
        ]) => {
          let raw;
          // If decorating, gather all again
          if (this.fleckImplementation(fleck, `${hook}.decorate`)) {
            raw = await this.invokeMergeAsync(hook);
            debugSilly('%s implements %s.decorate', fleck, hook);
          }
          // If only implementing, gather and decorate.
          else if (this.fleckImplementation(fleck, hook)) {
            raw = await this.invokeFleck(hook, fleck);
            debugSilly('%s implements %s', fleck, hook);
          }
          if (raw) {
            const decorated = await this.checkAndDecorateRawGathered(hook, raw, check);
            debug('updating gathered %s from %s...', hook, fleck);
            debugSilly('%O', decorated);
            const entries = Object.entries(decorated);
            entries.forEach(([type, Class]) => {
              const {[type]: {[idProperty]: id}} = gathered;
              const Subclass = wrapGathered(Class, id, idProperty, type, typeProperty);
              // eslint-disable-next-line no-multi-assign
              gathered[type] = Subclass;
              gathered[id] = Subclass;
              gathered[exports.ById][id] = Subclass;
              gathered[exports.ByType][type] = Subclass;
              this.invoke('@flecks/core.hmr.gathered.class', Subclass, hook);
            });
            this.invoke('@flecks/core.hmr.gathered', gathered, hook);
          }
        }),
    );
  }

  /**
   * Register hooks for a fleck.
   *
   * @param {string} fleck
   * @param {object} M The fleck module
   * @protected
   */
  registerFleckHooks(fleck, M) {
    debugSilly('registering %s...', fleck);
    this.flecks[fleck] = M;
    if (M.hooks) {
      const hooks = Object.keys(M.hooks);
      debugSilly("hooks for '%s': %O", fleck, hooks);
      for (let j = 0; j < hooks.length; j++) {
        const hook = hooks[j];
        if (!this.hooks[hook]) {
          this.hooks[hook] = [];
        }
        if ('function' !== typeof M.hooks[hook]) {
          throw new TypeError(
            `Hook implementation must be a function! ('${fleck}' implementing '${hook}')`,
          );
        }
        this.hooks[hook].push({fleck, fn: M.hooks[hook]});
      }
    }
  }

  /**
   * Set a configuration value.
   *
   * @param {string} path The configuration path e.g. `@flecks/example.config`.
   * @param {*} value The value to set.
   * @returns {*} The value that was set.
   */
  set(path, value) {
    return set(this.config, path, value);
  }

  /**
   * Unregister hooks for a fleck.
   * @param {*} fleck
   */
  unregisterFleckHooks(fleck) {
    const hooks = Object.keys(this.hooks);
    for (let j = 0; j < hooks.length; j++) {
      const hook = hooks[j];
      if (this.hooks[hook]) {
        const index = this.hooks[hook].findIndex(({fleck: hookPlugin}) => hookPlugin === fleck);
        if (-1 !== index) {
          this.hooks[hook].splice(index, 1);
        }
      }
    }
  }

};

exports.Flecks.get = get;
exports.Flecks.set = set;
