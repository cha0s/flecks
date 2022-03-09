<div align="center">
  <h1>flecks</h1>
  <p>
    Flecks is a dynamic, configuration-driven, fullstack application production system. Its purpose
    is to make application development a more joyful endeavor. Intelligent defaults combined with
    a highly dynamic structure encourage consistency while allowing you to easily express your own
    opinions.
  </p>
  <!-- <p>For documentation, see <a href="ADDME">the documentation page</a>.</p> -->

  ## ✴️ BE WARY ✴️

  This is largely untested software. There are undoubtedly many bugs that haven't yet been found.
  
  I reserve the right to break all semantic versioning guarantees as long as the project is v1.x.x! 😈
  
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

Modern features you expect &mdash; like

- linting
- testing
- HMR (even on server 😳)
- SSR

Things you don't expect &mdash; like

- Dynamic CLI (hooks)
- Dynamic REPL (hooks)
- Dynamic build (include `@flecks/react` into your fleck and watch it learn to compile JSX, even on the server side)
- Freedom to split up e.g. Redux applications into discrete slices while relying on flecks to automatically handle things like middleware, reducer composition, server/localStorage hydration, etc.
- Basically your imagination. [Write a hook](packages/core/build/dox/concepts/hooks.md).

## Concepts

### Eeez vereh flecksible 🥴

At its core, flecks is a collection of modules that use [hooks](packages/core/build/dox/concepts/hooks.md) to orchestrate everything from building your project to handling the minutia of what happens when your application starts, when a client connects, defining database models, and more.

Just to give you an idea of the power of hooks, some will be listed here:

- [`@flecks/http/server.stream.html`](https://github.com/cha0s/flecks/blob/gh-pages/hooks.md#fleckshttpserverstreamhtml)
  > Compose the server-side HTML stream. This is how SSR slides in.
- [`@flecks/docker.containers`](https://github.com/cha0s/flecks/blob/gh-pages/hooks.md#flecksdockercontainers)
  > Define [Docker](https://www.docker.com/) containers to automatically come up next to your app. See [`@flecks/redis`'s implementation](packages/redis/src/containers.js). `@flecks/docker` also generates `Dockerfile` and `docker-compose.yml` and provides the [CLI command](https://github.com/cha0s/flecks/blob/gh-pages/hooks.md#fleckscorecommands) `flecks docker` for even more.
- [`@flecks/http/server.request.route`](https://github.com/cha0s/flecks/blob/gh-pages/hooks.md#fleckshttpserverrequestroute)
  > Define [Express](http://expressjs.com/) middleware that runs when an HTTP route is hit.
- [... and many more on the hook reference page](https://github.com/cha0s/flecks/blob/gh-pages/hooks.md)

There are many hooks and they will not be treated exhaustively here. See the documentation page above.
    
### The `build` directory

Flecks applications contain a `build` directory with a `flecks.yml` that defines the flecks use to compose the project, as well as build-time configuration.

Flecks strives to provide powerful defaults that minimize the need to override configuration.

[Learn more about the build directory](packages/core/build/dox/concepts/build.md).

The simplest example of a flecks server application:

```yml
'@flecks/core': {}
'@flecks/server': {}
```

Yes, that's it! In fact, when you use `yarn create @flecks/app`, that's what is generated for you by default.

Obviously, this doesn't do much on its own. It simply bootstraps flecks and runs a server application with no interesting work to do.

---

Documentation is a work in progress <3
