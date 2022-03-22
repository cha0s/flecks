import {statSync} from 'fs';
import {dirname, sep} from 'path';

import {
  getEnv,
  OptionManager,
  transformSync,
  version,
} from '@babel/core';
import sourceMapSupport from 'source-map-support';

const cache = require('@babel/register/lib/cache');

const identity = (i) => i;

// This is basically what @babel/register does, but better in several ways.
class Compiler {

  constructor(options) {
    // Make some goodies exist in nodespace.
    this.options = {
      ...options,
      plugins: [
        ...(options.plugins || []),
        ...this.constructor.nodespaceBabelPlugins(),
      ],
    };
    this.constructor.warmUpCache();
  }

  compile(input, request) {
    const options = new OptionManager()
      .init({
        sourceRoot: `${dirname(request)}${sep}`,
        ...this.options,
        filename: request,
      });
    if (null === options) {
      return null;
    }
    const {cached, store} = this.lookup(options, request);
    if (cached) {
      return cached;
    }
    const {code, map} = transformSync(input, {
      ...options,
      sourceMaps: 'both',
      ast: false,
    });
    this.constructor.maps[request] = map;
    return store({code, map});
  }

  static installSourceMapSupport() {
    this.maps = Object.create(null);
    sourceMapSupport.install({
      handleUncaughtExceptions: false,
      environment: 'node',
      retrieveSourceMap: (request) => {
        const map = this.maps[request];
        if (map) {
          return {url: null, map};
        }
        return null;
      },
    });
  }

  lookup(options, request) {
    if (!this.constructor.cache) {
      return {
        cached: null,
        store: identity,
      };
    }
    let cacheKey = `${JSON.stringify(options)}:${version}`;
    const env = getEnv();
    if (env) {
      cacheKey += `:${env}`;
    }
    const cached = this.constructor.cache[cacheKey];
    const {mtime} = +statSync(request);
    if (cached && cached.mtime === mtime) {
      return {
        cached: cached.value,
        store: identity,
      };
    }
    return {
      cached: null,
      store: (value) => {
        this.constructor.cache[cacheKey] = {mtime, value};
        cache.setDirty();
        return value;
      },
    };
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
            '  const {join} = require("path");',
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
            '  const R = (request) => {',
            '    if (-1 === keys.indexOf(request)) {',
            // eslint-disable-next-line no-template-curly-in-string
            '      throw new Error(`Cannot find module \'${request}\'`);',
            '    }',
            '    return require(join(__dirname, directory, request));',
            '  };',
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
    ];
  }

  static warmUpCache() {
    if ('undefined' === typeof this.cache) {
      cache.load();
      this.cache = cache.get();
      this.installSourceMapSupport();
    }
  }

}

export default Compiler;
