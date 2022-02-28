# Build directory ⚡️

The `build` directory is where build-time configuration is specified.

The prime example of this for Flecks is `flecks.yml`, but it extends to other more general
configuration such as `.eslintrc.js`, `babel.config.js`, etc.

## `flecks.yml` ⛏️

`flecks.yml` specifies the flecks that compose your project.

Using `@flecks/create-fleck` creates the following `flecks.yml`:

```yml
'@flecks/core': {}
'@flecks/fleck': {}
```

This means that by default a new fleck will pull in the `@flecks/core` fleck, and the
`@flecks/fleck` fleck, both with default configuration.

### Overriding configuration 💪

`@flecks/core`'s configuration has an `id` key. Starting from the example above, overriding the
ID to, say, `'example'`, would look like this:

```yml
'@flecks/core':
  id: 'example'
'@flecks/fleck': {}
```

### Aliasing 🕵️‍♂️

Flecks may be aliased to alternative paths.

Say you have an application structured as a monorepo with a `packages` directory. If you have a
subpackage named `@my-monorepo/foo`, you could alias your fleck, like so:

```yml
'@flecks/core': {}
'@flecks/server': {}
'@my-monorepo/foo:./packages/foo/src': {}
```

Within your application, the fleck will be referred to as `@my-monorepo/foo` even though
`./packages/foo/src` is where the package is actually located.

This way you can use package structure without having to worry about actually publishing them to
npm (or running verdaccio, for instance).

## On-the-fly compilation(!) 🤯

If your flecks are aliased (as above) or symlinked (e.g. `yarn link`), they will be treated
specially and will be compiled on-the-fly. The flecks are searched for a local `babel.config.js`,
which is used to compile the code if present.

This means you can e.g. develop your `packages` in a monorepo with full HMR support, on both the
server and the client, each with their own babel configuration!

Have fun!

## Resolution order 🤔

The flecks server provides an interface (`flecks.localConfig()`) for gathering configuration files
from the `build` directory. The resolution order is determined by a few variables:

- `filename` specifies the name of the configuration file, e.g. `babel.config.js`.

- `general` specifies a general variation of the given configuration. `@flecks/server` looks for
  an overridden `server.neutrinorc.js` when building, however `general` is set to `.neutrinorc.js`,
  so it will also accept overrides of that more general configuration file.

- `root` specifies an alternative location to search. Defaults to `FLECKS_CORE_ROOT`.

- `fleck` specifies the fleck owning the configuration. `@flecks/core` owns `babel.config.js`,
  `@flecks/server` owns `server.neutrinorc.js`, etc. This only really matters if you are writing a
  fleck that owns its configuration.

Given these considerations, and supposing we had the above variables set like:

```javascript
const filename = 'server.neutrinorc.js';
const general = '.neutrinorc.js';
const root = '/foo/bar/baz';
const fleck = '@flecks/server';
```

We would then expect flecks to search using the following resolution order:

- `/foo/bar/baz/build/server.neutrinorc.js`
- `/foo/bar/baz/build/.neutrinorc.js`
- `${FLECKS_CORE_ROOT}/build/server.neutrinorc.js`
- `${FLECKS_CORE_ROOT}/build/.neutrinorc.js`
- `@flecks/server/build/server.neutrinorc.js`
- `@flecks/server/build/.neutrinorc.js`
