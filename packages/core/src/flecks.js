// eslint-disable-next-line max-classes-per-file
import {
  basename,
  dirname,
  extname,
  join,
} from 'path';

import get from 'lodash.get';
import set from 'lodash.set';
import without from 'lodash.without';

import D from './debug';
import Middleware from './middleware';

const debug = D('@flecks/core/flecks');

export const ById = Symbol.for('@flecks/core.byId');
export const ByType = Symbol.for('@flecks/core.byType');
export const Hooks = Symbol.for('@flecks/core.hooks');

const capitalize = (string) => string.substring(0, 1).toUpperCase() + string.substring(1);

const camelCase = (string) => string.split(/[_-]/).map(capitalize).join('');

const hotGathered = new Map();

const wrapperClass = (Class, id, idAttribute, type, typeAttribute) => {
  class Subclass extends Class {

    static get [idAttribute]() {
      return id;
    }

    static get [typeAttribute]() {
      return type;
    }

  }
  return Subclass;
};

export default class Flecks {

  constructor({
    config = {},
    flecks = {},
    platforms = [],
  } = {}) {
    this.config = {
      ...Object.fromEntries(Object.keys(flecks).map((path) => [path, {}])),
      ...config,
    };
    this.hooks = {};
    this.flecks = {};
    this.platforms = platforms;
    const entries = Object.entries(flecks);
    debug('paths: %O', entries.map(([fleck]) => fleck));
    for (let i = 0; i < entries.length; i++) {
      const [fleck, M] = entries[i];
      this.registerFleck(fleck, M);
    }
    this.configureFlecks();
    debug('config: %O', this.config);
  }

  configureFleck(fleck) {
    this.config[fleck] = {
      ...this.invokeFleck('@flecks/core.config', fleck),
      ...this.config[fleck],
    };
  }

  configureFlecks() {
    const defaultConfig = this.invoke('@flecks/core.config');
    const flecks = Object.keys(defaultConfig);
    for (let i = 0; i < flecks.length; i++) {
      this.configureFleck(flecks[i]);
    }
  }

  static decorate(
    context,
    {
      transformer = camelCase,
    } = {},
  ) {
    return (Gathered, flecks) => {
      context.keys()
        .forEach((path) => {
          const {default: M} = context(path);
          if ('function' !== typeof M) {
            throw new ReferenceError(
              `Flecks.decorate(): require(${
                path
              }).default is not a function (from: ${
                context.id
              })`,
            );
          }
          const key = transformer(this.symbolizePath(path));
          // eslint-disable-next-line no-param-reassign
          Gathered[key] = M(Gathered[key], flecks);
        });
      return Gathered;
    };
  }

  expandedFlecks(hook) {
    const flecks = this.lookupFlecks(hook);
    let expanded = [];
    for (let i = 0; i < flecks.length; ++i) {
      const fleck = flecks[i];
      expanded.push(fleck);
      for (let j = 0; j < this.platforms.length; ++j) {
        const platform = this.platforms[j];
        const variant = join(fleck, platform);
        if (this.fleck(variant)) {
          expanded.push(variant);
        }
      }
    }
    const index = expanded.findIndex((fleck) => '...' === fleck);
    if (-1 !== index) {
      if (-1 !== expanded.slice(index + 1).findIndex((fleck) => '...' === fleck)) {
        throw new Error(
          `Illegal ordering specification: hook '${hook}' has multiple ellipses.`,
        );
      }
      const before = expanded.slice(0, index);
      const after = expanded.slice(index + 1);
      const implementing = this.flecksImplementing(hook);
      const all = [];
      for (let i = 0; i < implementing.length; ++i) {
        const fleck = implementing[i];
        all.push(fleck);
        for (let j = 0; j < this.platforms.length; ++j) {
          const platform = this.platforms[j];
          const variant = join(fleck, platform);
          if (this.fleck(variant)) {
            all.push(variant);
          }
        }
      }
      const rest = without(all, ...before.concat(after));
      expanded = [...before, ...rest, ...after];
    }
    return expanded;
  }

  fleck(fleck) {
    return this.flecks[fleck];
  }

  fleckImplements(fleck, hook) {
    return !!this.hooks[hook].find(({fleck: candidate}) => fleck === candidate);
  }

  flecksImplementing(hook) {
    return this.hooks[hook]?.map(({fleck}) => fleck) || [];
  }

  gather(
    hook,
    {
      idAttribute = 'id',
      typeAttribute = 'type',
      check = () => {},
    } = {},
  ) {
    if (!hook || 'string' !== typeof hook) {
      throw new TypeError('Flecks.gather(): Expects parameter 1 (hook) to be string');
    }
    const raw = this.invokeMerge(hook);
    check(raw, hook);
    const decorated = this.invokeComposed(`${hook}.decorate`, raw);
    check(decorated, `${hook}.decorate`);
    let uid = 1;
    const ids = {};
    const types = (
      Object.fromEntries(
        Object.entries(decorated)
          .sort(([ltype], [rtype]) => (ltype < rtype ? -1 : 1))
          .map(([type, Class]) => {
            const id = uid++;
            ids[id] = wrapperClass(Class, id, idAttribute, type, typeAttribute);
            return [type, ids[id]];
          }),
      )
    );
    const gathered = {
      ...ids,
      ...types,
      [ById]: ids,
      [ByType]: types,
    };
    hotGathered.set(hook, {idAttribute, gathered, typeAttribute});
    debug("gathered '%s': %O", hook, gathered);
    return gathered;
  }

  get(path, defaultValue) {
    return get(this.config, path, defaultValue);
  }

  invoke(hook, ...args) {
    if (!this.hooks[hook]) {
      return {};
    }
    return this.flecksImplementing(hook)
      .reduce((r, fleck) => ({
        ...r,
        [fleck]: this.invokeFleck(hook, fleck, ...args),
      }), {});
  }

  invokeComposed(hook, arg, ...args) {
    if (!this.hooks[hook]) {
      return arg;
    }
    const flecks = this.expandedFlecks(hook);
    if (0 === flecks.length) {
      return arg;
    }
    return flecks
      .filter((fleck) => this.fleckImplements(fleck, hook))
      .reduce((r, fleck) => this.invokeFleck(hook, fleck, r, ...args), arg);
  }

  async invokeComposedAsync(hook, arg, ...args) {
    if (!this.hooks[hook]) {
      return arg;
    }
    const flecks = this.expandedFlecks(hook);
    if (0 === flecks.length) {
      return arg;
    }
    return flecks
      .filter((fleck) => this.fleckImplements(fleck, hook))
      .reduce(async (r, fleck) => this.invokeFleck(hook, fleck, await r, ...args), arg);
  }

  invokeFlat(hook, ...args) {
    if (!this.hooks[hook]) {
      return [];
    }
    return this.hooks[hook].map(({fleck}) => this.invokeFleck(hook, fleck, ...args));
  }

  invokeFleck(hook, fleck, ...args) {
    debug('invokeFleck(%s, %s, ...)', hook, fleck);
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

  invokeMerge(hook, ...args) {
    return this.invokeReduce(hook, (r, o) => ({...r, ...o}), {}, ...args);
  }

  async invokeMergeAsync(hook, ...args) {
    return this.invokeReduceAsync(hook, (r, o) => ({...r, ...o}), {}, ...args);
  }

  invokeReduce(hook, reducer, initial, ...args) {
    if (!this.hooks[hook]) {
      return initial;
    }
    return this.hooks[hook]
      .reduce((r, {fleck}) => reducer(r, this.invokeFleck(hook, fleck, ...args)), initial);
  }

  async invokeReduceAsync(hook, reducer, initial, ...args) {
    if (!this.hooks[hook]) {
      return initial;
    }
    return this.hooks[hook]
      .reduce(
        async (r, {fleck}) => reducer(await r, await this.invokeFleck(hook, fleck, ...args)),
        initial,
      );
  }

  invokeSequential(hook, ...args) {
    if (!this.hooks[hook]) {
      return [];
    }
    const flecks = this.expandedFlecks(hook);
    if (0 === flecks.length) {
      return [];
    }
    const results = [];
    while (flecks.length > 0) {
      const fleck = flecks.shift();
      if (this.fleckImplements(fleck, hook)) {
        results.push(this.invokeFleck(hook, fleck, ...args));
      }
    }
    return results;
  }

  async invokeSequentialAsync(hook, ...args) {
    if (!this.hooks[hook]) {
      return [];
    }
    const flecks = this.expandedFlecks(hook);
    if (0 === flecks.length) {
      return [];
    }
    const results = [];
    while (flecks.length > 0) {
      const fleck = flecks.shift();
      if (this.fleckImplements(fleck, hook)) {
        // eslint-disable-next-line no-await-in-loop
        results.push(await this.invokeFleck(hook, fleck, ...args));
      }
    }
    return results;
  }

  isOnPlatform(platform) {
    return -1 !== this.platforms.indexOf(platform);
  }

  lookupFlecks(hook) {
    const index = hook.indexOf('.');
    if (-1 === index) {
      return ['...'];
    }
    return this.get([hook.slice(0, index), hook.slice(index + 1)], ['...']);
  }

  makeMiddleware(hook) {
    debug('makeMiddleware(...): %s', hook);
    if (!this.hooks[hook]) {
      return Promise.resolve();
    }
    const flecks = this.expandedFlecks(hook);
    if (0 === flecks.length) {
      return Promise.resolve();
    }
    const middleware = flecks
      .filter((fleck) => this.fleckImplements(fleck, hook));
    debug('middleware: %O', middleware);
    const instance = new Middleware(middleware.map((fleck) => this.invokeFleck(hook, fleck)));
    return async (...args) => {
      const next = args.pop();
      try {
        await instance.promise(...args);
        next();
      }
      catch (error) {
        next(error);
      }
    };
  }

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
              transformer(this.symbolizePath(path)),
              invoke ? M(flecks) : M,
            ];
          }),
      )
    );
  }

  refresh(fleck, M) {
    debug('refreshing %s...', fleck);
    // Remove old hook implementations.
    const keys = Object.keys(this.hooks);
    for (let j = 0; j < keys.length; j++) {
      const key = keys[j];
      if (this.hooks[key]) {
        const index = this.hooks[key].findIndex(({fleck: hookPlugin}) => hookPlugin === fleck);
        if (-1 !== index) {
          this.hooks[key].splice(index, 1);
        }
      }
    }
    // Replace the fleck.
    this.registerFleck(fleck, M);
    // Write config.
    this.configureFleck(fleck);
    // HMR.
    this.updateHotGathered(fleck);
  }

  registerFleck(fleck, M) {
    debug('registering %s...', fleck);
    this.flecks[fleck] = M;
    if (M.default) {
      const {default: {[Hooks]: hooks}} = M;
      if (hooks) {
        const keys = Object.keys(hooks);
        debug("hooks for '%s': %O", fleck, keys);
        for (let j = 0; j < keys.length; j++) {
          const key = keys[j];
          if (!this.hooks[key]) {
            this.hooks[key] = [];
          }
          this.hooks[key].push({fleck, fn: hooks[key]});
        }
      }
    }
    else {
      debug("'%s' has no default export: %O", fleck, M);
    }
  }

  set(path, value) {
    return set(this.config, path, value);
  }

  static symbolizePath(path) {
    const parts = dirname(path).split('/');
    if ('.' === parts[0]) {
      parts.shift();
    }
    if ('index' === parts[parts.length - 1]) {
      parts.pop();
    }
    return join(parts.join('-'), basename(path, extname(path)));
  }

  async up(hook) {
    await Promise.all(this.invokeFlat('@flecks/core.starting'));
    await this.invokeSequentialAsync(hook);
  }

  updateHotGathered(fleck) {
    const it = hotGathered.entries();
    for (let current = it.next(); current.done !== true; current = it.next()) {
      const {
        value: [
          hook,
          {
            idAttribute,
            gathered,
            typeAttribute,
          },
        ],
      } = current;
      const updates = this.invokeFleck(hook, fleck);
      if (updates) {
        debug('updating gathered %s from %s...', hook, fleck);
        const entries = Object.entries(updates);
        for (let i = 0, [type, Class] = entries[i]; i < entries.length; ++i) {
          const {[type]: {[idAttribute]: id}} = gathered;
          const Subclass = wrapperClass(Class, id, idAttribute, type, typeAttribute);
          // eslint-disable-next-line no-multi-assign
          gathered[type] = gathered[id] = gathered[ById][id] = gathered[ByType][type] = Subclass;
          this.invoke('@flecks/core.hmr.gathered', Subclass, hook);
        }
      }
    }
  }

}
