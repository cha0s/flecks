# Hooks

Hooks are how everything happens in flecks. There are many hooks and the hooks provided by flecks are documented at the [hooks reference page](ADDME).

To define hooks (and turn your plain ol' boring JS modules into beautiful interesting flecks), you only have to import the `Hooks` symbol and key your default export:

```javascript
import {Hooks} from '@flecks/core';

export default {
  [Hooks]: {
    '@flecks/core.starting': () => {
      console.log('hello, gorgeous');
    },
  },
};
```

**Note:** All hooks recieve an extra final argument, which is the flecks instance.

## Types

&nbsp;

### `invoke(hook, ...args)`

Invokes all hook implementations and returns the results keyed by the implementing flecks' paths.

&nbsp;

### `invokeComposed(hook, initial, ...args)`
### `invokeComposedAsync(hook, initial, ...args)`

See: [function composition](https://www.educative.io/edpresso/function-composition-in-javascript).

`initial` is passed to the first implementation, which returns a result which is passed to the second implementation, which returns a result which is passed to the third implementation, etc.

Composed hooks are [ordered](#ordered-hooks).

&nbsp;

### `invokeFlat(hook, ...args)`

Invokes all hook implementations and returns the results as an array.

&nbsp;

### `invokeFleck(hook, fleck, ...args)`

Invoke a single fleck's hook implementation and return the result.

&nbsp;

### `invokeMerge(hook, ...args)`
### `invokeMergeAsync(hook, ...args)`

Invokes all hook implementations and returns the result of merging all implementations' returned objects together.

&nbsp;

### `invokeReduce(hook, reducer, initial, ...args)`
### `invokeReduceAsync(hook, reducer, initial, ...args)`

See: [Array.prototype.reduce()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce)

Invokes hook implementations one at a time, their results being passed to the reducer as `currentValue`. Returns the final reduction.

&nbsp;

### `invokeSequential(Async)?(hook, ...args)`

Invokes all hook implementations, one after another. In the async variant, each implementation's result is `await`ed before invoking the next implementation.

Sequential hooks are [ordered](#ordered-hooks).

&nbsp;

## Idioms

### `flecks.gather(hook, options)`

Gathering is useful when your fleck defines some sort of specification, and then expects its sibling flecks to actually implement it. Examples of this in flecks would be:

- Models, defined through `@flecks/db/server.models`.
- Packets, defined through `@flecks/socket.packets`.

One constraint of using `flecks.gather()` is that whatever you are gathering must be able to be extended as a class. You can't `flecks.gather()` plain objects, numbers, strings... you get the idea.

The most basic usage:

```javascript
const Gathered = flecks.gather('my-gather-hook');
```

Suppose `my-gather-hook` above resulted in gathering two classes, `Foo` and `Bar`. In this case, `Gathered` would be such as:

```javascript
import {ById, ByType} from '@flecks/core';

const Gathered = {
  1: Bar,
  2: Foo,
  'Bar': Bar,
  'Foo': Foo,
  [ById]: {
    1: Bar,
    2: Foo,
  },
  [ByType]: {
    'Bar': Bar,
    'Foo': Foo,
  },
};
```

`flecks.gather()` gives each of your classes a numeric (nonzero) ID as well as a type name. It also merges all numeric keys and type labels together into the result, so `Gathered[1] === Gathered.Bar` would evaluate to `true` in the example above.

The symbol keys `ById` and `ByType` are useful if you need to iterate over *either* all IDs or all types. Since the numeric IDs and types are merged, iterating over the entire `Gathered` object would otherwise result in duplicates.

Each class gathered by `flecks.gather()` will be extended with two properties by default: `id` and `type`. These correspond to the ID and type referenced above, and are useful for e.g. serialization.

Following from the example above:

```javascript
const foo = new Gathered.Foo();
assert(foo.id === 2);
assert(foo.type === 'Foo);
```

`flecks.gather()` also supports some options:

```javascript
{
  // The property added when extending the class to return the numeric ID.
  idAttribute = 'id',
  // The property added when extending the class to return the type.
  typeAttribute = 'type',
  // A function called with the `Gathered` object to allow checking validity.
  check = () => {},
}
```

As an example, when `@flecks/db/server` gathers models, `typeAttribute` is set to `name`, because Sequelize requires its model classes to have a unique `name` property.

**Note:** the numeric IDs are useful for efficient serialization between the client and server, but **if you are using this property, ensure that `flecks.gather()` is called equivalently on both the client and the server**. As a rule of thumb, if you have serializable `Gathered`s, they should be invoked and defined in `your-fleck`, and not in `your-fleck/[platform]`, so that they are invoked for every platform.

#### `Flecks.provide(context, options)`

Complementary to gather hooks above, `Flecks.provide()` allows you to ergonomically provide your flecks' implementations to a gather hook.

Here's an example of how you could manually provide `@flecks/db/server.models` in your own fleck:

```javascript
import {Hooks} foom '@flecks/core';

import SomeModel from './models/some-model';
import AnotherModel from './models/another-model';

export default {
  [Hooks]: {
    '@flecks/db/server.models': () => ({
      SomeModel,
      AnotherModel,
    }),
  },
};
```

If you think about the example above, you might realize that it will become a lot of typing to keep adding new models over time. Provider hooks exist to reduce this maintenance burden for you.

Webpack provides an API called [require.context](https://v4.webpack.js.org/guides/dependency-management/#requirecontext), and the flecks provider is optimized to work with this API.

Supposing our fleck is structured like so:

```
index.js
models/
├─ some-model.js
└─ another-model.js
```

then, this `index.js`:

```javascript
import {Flecks, Hooks} from '@flecks/core';

export default {
  [Hooks]: {
    '@flecks/db/server.models': Flecks.provide(require.context('./models', false, /\.js$/)),
  },
};
```

is *exactly equivalent* to the gather example above. By default, `Flecks.provide()` *CamelCase*s the paths, so `some-model` becomes `SomeModel`, just as in the example above.

`Flecks.provide()` also supports some options:

```javascript
{
  // The transformation used on the class path.
  transformer = camelCase,
}
```

**Note:** There is no requirement to use `Flecks.provide()`, it is merely a convenience.

### Decorator hooks

When a Model (or any other) is gathered as above, an implicit hook is called: `${hook}.decorate`. This allows other flecks to decorate whatever has been gathered:

```javascript
import {Hooks} from '@flecks/core';

export default {
  [Hooks]: {
    '@flecks/db/server.models.decorate': (Models) => {
      return {
        ...Models,
        User: class extends Models.User {
          
          // Let's mix in some logging...
          constructor(...args) {
            super(...args);
            console.log ('Another user decorated!');
          }
          
        },
      };
    },
  },
};
```

#### `Flecks.decorate(context, options)`

As with above, there exists an API for making the maintenance of decorators more ergonomic.

Supposing our fleck is structured like so:

```
index.js
models/
└─ decorators/
   └─ user.js
```

and supposing that `./models/decorators/user.js` is written like so:

```javascript
export default (User) => {
  return class extends User {
          
    // Let's mix in some logging...
    constructor(...args) {
      super(...args);
      console.log ('Another user decorated!');
    }
          
  };
};
```

then, this `index.js`:

```javascript
import {Flecks, Hooks} from '@flecks/core';

export default {
  [Hooks]: {
    '@flecks/db/server.models.decorate': Flecks.decorate(require.context('./models/decorators', false, /\.js$/)),
  },
};
```

is *exactly equivalent* to the decorator example above. 

`Flecks.decorate()` also supports some options:

```javascript
{
  // The transformation used on the class path.
  transformer = camelCase,
}
```

Decorator hooks are [ordered](#ordered-hooks).

## Ordered hooks

In many of the instances above, reference was made to the fact that certain hook types are "ordered".

Suppose we are composing an application and we have HTTP session state using cookies. When a user hits a route, we need to load their session and subsequently read a value from said session to determine if the user prefers dark mode. Clearly, we will have to ensure that the session reification happens first. This is one function of ordered hooks.

Flecks uses the name of the hook as a configuration key in order to determine the ordering of a hook. Let's take the hook we alluded to earlier as an example, `@flecks/http/server.request.route`:

Our `flecks.yml` could be configured like so:

```yaml
'@flecks/http/server':
  'request.route':
    - '@flecks/user/session'
    - 'my-cool-fleck'
```

In this application, when `@flecks/http/server.request.route` is invoked, `@flecks/user/session`'s implementation is invoked (which reifies the user's session from cookies), followed by `my-cool-fleck`'s (which, we assume, does some kind of very cool dark mode check).

It may not always be ergonomic to configure the order of every single implementation, but enough to specify which implementations must run first (or last).

For example, suppose we have multiple implementations that require there to have been a reified user session, but which order those implementations run might not be a concern. For this, flecks provides you with the ellipses entry:

```yaml
'@flecks/http/server':
  'request.route':
    - '@flecks/user/session'
    - '...'
    - 'some-final-fleck'
```

In this application, we first reify the user session as before, but instead of listing `my-cool-fleck` immediately after, we specify ellipses. After the ellipses we specify `some-final-fleck` to, we assume, do some finalization work.

Ellipses essentially translate to: "every implementing fleck which has not already been explicitly listed in the ordering configuration".

Using more than one ellipses entry in an ordering configuration is ambiguous and will throw an error.

The default ordering configuration for any ordered hook is: `['...']` which translates to all implementations in an undefined order.