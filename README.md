<div align="center">
  <h1>flecks</h1>
  <p>
    Flecks is a dynamic, configuration-driven, fullstack application production system. Its purpose
    is to make application development a more joyful endeavor. Intelligent defaults combined with
    a highly dynamic structure encourage consistency while allowing you to easily express your own
    opinions.
  </p>
  <p>For documentation, see <a href="ADDME">the documentation page</a>.</p>

  ## ⚠️ PROCEED AT YOUR OWN RISK ⚠️

  This is alpha software. There are undoubtedly many bugs that haven't yet been found. I reserve
  the right to break all semantic versioning guarantees as long as the project is v1.x.x!
  
  **You've been warned!**
</div>


## Table of Contents

1. [Install](#install)
2. [Introduction](#introduction)
3. [Concepts](#concepts)

## Install

Quickly scaffold a new application monorepo:
```
yarn create @flecks/app my-new-app
```

or with `npm`:
```
npx @flecks/create-app my-new-app
```

---

Quickly scaffold a new fleck:
```
yarn create @flecks/fleck my-new-fleck
```

or with `npm`:
```
npx @flecks/create-fleck my-new-fleck
```

## Introduction

### Eeez vereh flecksible 🥴

At its core, flecks is a collection of modules that use [hooks](#hooks) to orchestrate everything
from building your project to handling the minutia of what happens when your application starts,
when a client connects, defining database models, and more.

All flecks projects, be they an application or another fleck, contain a `build` directory with a
[`flecks.yml`](#flecksyml) that defines the flecks use to compose the project, as well as
build-time configuration.

Modern features you expect &mdash; like [ESLint](https://eslint.org/),
[Mocha tests](https://mochajs.org/),
[Hot Module Replacement (HMR)](https://v4.webpack.js.org/guides/hot-module-replacement/),
[SSR](https://reactjs.org/docs/react-dom-server.html) &mdash; are baked in. Along with some you
may not expect &mdash; like *server-side* HMR, the ability to define [redux](https://redux.js.org/)
application state (and store enhancers/middleware) dynamically with hooks,
[REPL](https://nodejs.org/api/repl.html) support, and much more.
    
## Concepts

### `build` directory

The `build` directory contains build directives and run commands. Examples of these would be:

- `babel.config.js`
- `.eslint.defaults.js`
- `.neutrinorc.js`
- `webpack.config.js`
- etc, etc, depending on which flecks you have enabled. Support for the aforementioned
  configuration comes stock in `@flecks/core`.

The `build` directory is a solution to the problem of "ejecting" that you run into with
e.g. Create React App. Flecks doesn't force you into an all-or-nothing approach. If your project
requires advanced configuration for one aspect, you can simply override that aspect of
configuration in your `build` directory on a case-by-case basis.

Of course, flecks strives to provide powerful defaults that minimize the need to override
configuration.

See [the build directory documentation page](packages/core/build/dox/build.md) for more details.

---

#### `flecks.yml`

The build directory also contains a special file, `flecks.yml`. This file is the heart of your
flecks project's configuration and is how you orchestrate your project.

The structure of the file is an object whose keys are the flecks composing your application and
whose values are the default configuration for those flecks.

```yml
# Specify configuration overrides for this fleck:
'my-fleck':
  some_value: 69
  some_other_value: 420
# Default configuration:
'some-other-fleck': {}
```

The simplest example of a flecks server application:

```yml
'@flecks/core': {}
'@flecks/server': {}
```

Yes, that's it! In fact, when you use `yarn create @flecks/app`, that's what is generated for you
by default. Obviously, this doesn't do much on its own. It simply bootstraps flecks and runs a
server application with no interesting work to do.

---

### Hooks

Documentation page: (ADDME)

Hooks are how everything happens in flecks. There are many hooks and they will not be treated
exhaustively here. See the documentation page above.

To define hooks (and turn your plain ol' boring JS modules into beautiful interesting flecks), you
only have to import the `Hooks` symbol and key your default export:

```javascript
import {Hooks} from '@flecks/core';

export default {
  [Hooks]: {
    '@flecks/core/starting': () => {
      console.log('hello, gorgeous');
    },
  },
};
```

Now add your newly-minted fleck to [`flecks.yml`](#flecksyml), and let your fledgling fleck treat
you the way you deserve to be treated.

Just to give you an idea of the power of hooks, some will be listed here:

- `@flecks/core/config`:
  > Define default configuration.
- `@flecks/docker/containers`:
  > Define [Docker](https://www.docker.com/) containers to run alongside your application to
  develop e.g. DB models, redis commands, etc. without having to worry about installing stuff.
- `@flecks/http/server/request.route`:
  > Define [Express](http://expressjs.com/) middleware that runs when an HTTP route is hit.
- `@flecks/server/up`:
  > Do things when server comes up (e.g. DB connection, HTTP listener, make you coffee, etc).

...and so many more.

We didn't even touch on [gather hooks](ADDME), [provider hooks](ADDME), [decorator hooks](ADDME),
and so many more. Please see the [hook documentation page](ADDME) for the full rundown on all of
the wonderful things hooks can do for you.
