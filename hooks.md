# Hooks

This page documents all the hooks in this project.

## `@flecks/core.build`

> 
> Hook into webpack configuration.

<details>
<summary>Parameters</summary>
<ul>
<li><strong><code>{string}</code></strong> <code>target</code>
<blockquote>The build target; e.g. `server`.</blockquote></li>
<li><strong><code>{Object}</code></strong> <code>config</code>
<blockquote>The webpack configuration.</blockquote></li>
<li><strong><code>{Object}</code></strong> <code>env</code>
<blockquote>The webpack environment.</blockquote></li>
<li><strong><code>{Object}</code></strong> <code>argv</code>
<blockquote>The webpack commandline arguments.</blockquote></li>
</ul>
</details>

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/electron/src/server/index.js#L19'>@flecks/electron/src/server/index.js:19:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/react/src/server.js#L7'>@flecks/react/src/server.js:7:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/core/src/server/index.js#L34'>@flecks/core/src/server/index.js:34:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/web/src/server/index.js#L20'>@flecks/web/src/server/index.js:20:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/core/src/server/build/fleckspack.config.js#L76'>@flecks/core/src/server/build/fleckspack.config.js:76:6</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/core.build': (target, config, env, argv) => {
    if ('something' === target) {
      if ('production' === argv.mode) {
        config.plugins.push(new SomePlugin());
      }
    }
  }
};
```

## `@flecks/core.build.alter`

> 
> Alter build configurations after they have been hooked.

<details>
<summary>Parameters</summary>
<ul>
<li><strong><code>{Object}</code></strong> <code>configs</code>
<blockquote>The webpack configurations keyed by target.</blockquote></li>
<li><strong><code>{Object}</code></strong> <code>env</code>
<blockquote>The webpack environment.</blockquote></li>
<li><strong><code>{Object}</code></strong> <code>argv</code>
<blockquote>The webpack commandline arguments.</blockquote></li>
</ul>
</details>

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/electron/src/server/index.js#L58'>@flecks/electron/src/server/index.js:58:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/web/src/server/index.js#L21'>@flecks/web/src/server/index.js:21:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/core/src/server/build/fleckspack.config.js#L80'>@flecks/core/src/server/build/fleckspack.config.js:80:20</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/core.build.alter': (configs) => {
    // Maybe we want to do something if a target exists..?
    if (configs.someTarget) {
      // Do something...
      // And then maybe we want to remove it from the build configuration..? That's ok!
      delete configs.someTarget;
    }
  }
};
```

## `@flecks/core.build.config`

> 
> Register build configuration.
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/core/src/server/index.js#L72'>@flecks/core/src/server/index.js:72:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/web/src/server/index.js#L103'>@flecks/web/src/server/index.js:103:2</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/core.build.config': () => [
    /**
     * If you document your config files like this, documentation will be automatically
     * generated.
     */
    '.myrc.js',
    /**
     * Make sure you return them as an array expression, like this.
     */
    ['mygeneralrc.js', {specifier: (specific) => `${specific}.mygeneralrc.js`}],
  ]
};
```

## `@flecks/core.commands`

> 
> Define CLI commands.
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/docker/src/server.js#L11'>@flecks/docker/src/server.js:11:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/dox/src/server.js#L4'>@flecks/dox/src/server.js:4:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/repl/src/server.js#L5'>@flecks/repl/src/server.js:5:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/core/src/server/index.js#L95'>@flecks/core/src/server/index.js:95:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/fleck/src/server/index.js#L4'>@flecks/fleck/src/server/index.js:4:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/core/src/cli.js#L92'>@flecks/core/src/cli.js:92:21</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/core.commands': (program) => ({
    // So this could be invoked like:
    // npx flecks something -t --blow-up blah
    something: {
      action: (...args) => {
        // Run the command...
      },
      args: [
        '<somearg>',
      ],
      description: 'This command does tests and also blows up',
      options: [
        '-t, --test', 'Do a test',
        '-b, --blow-up', 'Blow up instead of running the command',
      ],
    },
  })
};
```

## `@flecks/core.config`

> 
> Define configuration.
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/db/src/server.js#L11'>@flecks/db/src/server.js:11:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/docker/src/server.js#L5'>@flecks/docker/src/server.js:5:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/dox/src/server.js#L5'>@flecks/dox/src/server.js:5:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/electron/src/server/index.js#L30'>@flecks/electron/src/server/index.js:30:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/governor/src/server.js#L9'>@flecks/governor/src/server.js:9:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/react/src/index.js#L16'>@flecks/react/src/index.js:16:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/redis/src/server.js#L29'>@flecks/redis/src/server.js:29:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/core/src/index.js#L12'>@flecks/core/src/index.js:12:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/core/src/server/index.js#L96'>@flecks/core/src/server/index.js:96:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/fleck/src/server/index.js#L5'>@flecks/fleck/src/server/index.js:5:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/server/src/index.js#L2'>@flecks/server/src/index.js:2:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/web/src/server/index.js#L117'>@flecks/web/src/server/index.js:117:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/user/src/local/server/index.js#L8'>@flecks/user/src/local/server/index.js:8:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/user/src/session/server.js#L9'>@flecks/user/src/session/server.js:9:2</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/core.config': () => ({
    whatever: 'configuration',
    your: 1337,
    fleck: 'needs',
    /**
     * Also, comments like this will be used to automatically generate documentation.
     */
    though: 'you should keep the values serializable',
  })
};
```

## `@flecks/core.hmr`

> 
> Invoked when a fleck is HMR'd

<details>
<summary>Parameters</summary>
<ul>
<li><strong><code>{string}</code></strong> <code>path</code>
<blockquote>The path of the fleck</blockquote></li>
<li><strong><code>{Module}</code></strong> <code>updatedFleck</code>
<blockquote>The updated fleck module.
   </blockquote></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/core.hmr': (path, updatedFleck) => {
    if ('my-fleck' === path) {
      updatedFleck.doSomething();
    }
  }
};
```

## `@flecks/core.hmr.gathered`

> 
> Invoked when a gathered class is HMR'd.

<details>
<summary>Parameters</summary>
<ul>
<li><strong><code>{constructor}</code></strong> <code>Class</code>
<blockquote>The class.</blockquote></li>
<li><strong><code>{string}</code></strong> <code>hook</code>
<blockquote>The gather hook; e.g. `@flecks/db/server.models`.
   </blockquote></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/core.hmr.gathered': (Class, hook) => {
    // Do something with Class...
  }
};
```

## `@flecks/core.starting`

> 
> Invoked when the application is starting. Use for order-independent initialization tasks.
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/db/src/server.js#L39'>@flecks/db/src/server.js:39:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/socket/src/index.js#L11'>@flecks/socket/src/index.js:11:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/web/src/server/index.js#L187'>@flecks/web/src/server/index.js:187:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/web/src/server/build/entry.js#L59'>@flecks/web/src/server/build/entry.js:59:22</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/core.starting': (flecks) => {
    flecks.set('$my-fleck/value', initializeMyValue());
  }
};
```

## `@flecks/core.targets`

> 
> Define build targets.
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/fleck/src/server/index.js#L23'>@flecks/fleck/src/server/index.js:23:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/server/src/server/index.js#L2'>@flecks/server/src/server/index.js:2:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/web/src/server/index.js#L196'>@flecks/web/src/server/index.js:196:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/core/src/server/build/fleckspack.config.js#L38'>@flecks/core/src/server/build/fleckspack.config.js:38:17</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/core/src/server/commands.js#L63'>@flecks/core/src/server/commands.js:63:26</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/core.targets': () => ['sometarget']
};
```

## `@flecks/db/server.models`

> 
> Gather database models.
> 
> In the example below, your fleck would have a `models` subdirectory, and each model would be
> defined in its own file.
> See: https://github.com/cha0s/flecks/tree/master/packages/user/src/server/models
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/governor/src/server.js#L27'>@flecks/governor/src/server.js:27:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/user/src/server/index.js#L9'>@flecks/user/src/server/index.js:9:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/db/src/server.js#L40'>@flecks/db/src/server.js:40:36</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/db/server.models': Flecks.provide(require.context('./models', false, /\.js$/))
};
```

## `@flecks/db/server.models.decorate`

> 
> Decorate database models.
> 
> In the example below, your fleck would have a `models/decorators` subdirectory, and each
> decorator would be defined in its own file.
> See: https://github.com/cha0s/flecks/tree/master/packages/user/src/local/server/models/decorators
> 

<details>
<summary>Parameters</summary>
<ul>
<li><strong><code>{constructor}</code></strong> <code>Model</code>
<blockquote>The model to decorate.
   </blockquote></li>
</ul>
</details>

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/user/src/local/server/index.js#L18'>@flecks/user/src/local/server/index.js:18:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/db/src/server.js#L40'>@flecks/db/src/server.js:40:36</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/db/server.models.decorate': Flecks.decorate(require.context('./models/decorators', false, /\.js$/))
};
```

## `@flecks/docker.containers`

> 
> Define docker containers.
> 
> Beware: the user running the server must have Docker privileges.
> See: https://docs.docker.com/engine/install/linux-postinstall/#manage-docker-as-a-non-root-user
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/db/src/server.js#L45'>@flecks/db/src/server.js:45:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/redis/src/server.js#L39'>@flecks/redis/src/server.js:39:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/docker/src/commands.js#L51'>@flecks/docker/src/commands.js:51:25</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/docker/src/server.js#L16'>@flecks/docker/src/server.js:16:29</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/docker.containers': () => ({
    someContainer: {
      // Environment variables.
      environment: {
        SOME_CONTAINER_VAR: 'hello',
      },
      // The docker image.
      image: 'some-image:latest',
      // Some container path you'd like to persist. Flecks handles the host path.
      mount: '/some/container/path',
      // Expose ports.
      ports: {3000: 3000},
    },
  })
};
```

## `@flecks/electron/server.initialize`

> 
> Invoked when electron is initializing.

<details>
<summary>Parameters</summary>
<ul>
<li><strong><code>{Electron}</code></strong> <code>electron</code>
<blockquote>The electron module.
   </blockquote></li>
</ul>
</details>

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/electron/src/server/index.js#L72'>@flecks/electron/src/server/index.js:72:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/electron/src/server/index.js#L132'>@flecks/electron/src/server/index.js:132:10</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/electron/server.initialize': (electron) => {
    electron.app.on('will-quit', () => {
      // ...
    });
  }
};
```

## `@flecks/electron/server.window`

> 
> Invoked when a window is created

<details>
<summary>Parameters</summary>
<ul>
<li><strong><code>{Electron.BrowserWindow}</code></strong> <code>win</code>
<blockquote>The electron browser window. See: https://www.electronjs.org/docs/latest/api/browser-window
   </blockquote></li>
</ul>
</details>

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/electron/src/server/index.js#L92'>@flecks/electron/src/server/index.js:92:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/electron/src/server/index.js#L15'>@flecks/electron/src/server/index.js:15:8</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/electron/server.window': (win) => {
    win.maximize();
  }
};
```

## `@flecks/react.providers`

> 
> Define React Providers.
> 
> Note: `req` will be only be defined when server-side rendering.

<details>
<summary>Parameters</summary>
<ul>
<li><strong><code>{http.ClientRequest}</code></strong> <code>req</code>
<blockquote>The HTTP request object.
   </blockquote></li>
</ul>
</details>

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/react/src/router/client.js#L7'>@flecks/react/src/router/client.js:7:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/react/src/router/server.js#L4'>@flecks/react/src/router/server.js:4:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/redux/src/client/index.js#L8'>@flecks/redux/src/client/index.js:8:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/redux/src/server.js#L33'>@flecks/redux/src/server.js:33:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/react/src/root.js#L15'>@flecks/react/src/root.js:15:26</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/react.providers': (req) => {
    // Generally it makes more sense to separate client and server concerns using platform
    // naming conventions, but this is just a small contrived example.
    return req ? serverSideProvider(req) : clientSideProvider();
  }
};
```

## `@flecks/react.roots`

> 
> Define root-level React components that are mounted as siblings on `#main`.
> Note: `req` will be only be defined when server-side rendering.
> 
> Return either a React component or an array whose elements must either be a React component
> or an array of two elements where the first element is the component and the second element
> is the props passed to the component.

<details>
<summary>Parameters</summary>
<ul>
<li><strong><code>{http.ClientRequest}</code></strong> <code>req</code>
<blockquote>The HTTP request object.
   </blockquote></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/react/src/root.js#L13'>@flecks/react/src/root.js:13:16</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/react.roots': (req) => {
    // Note that we're not returning `<Component />`, but `Component`.
    return [
      Component,
      [SomeOtherComponent, {prop: 'value'}]
    ];
    // You can also just:
    return Component;
  }
};
```

## `@flecks/redux.effects`

> 
> Define side-effects to run against Redux actions.
>    

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/redux/src/store/middleware/effects.js#L2'>@flecks/redux/src/store/middleware/effects.js:2:18</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/redux.effects': () => ({
    someActionName: (store, action) => {
      // Runs when `someActionName` actions are dispatched.
    },
  })
};
```

## `@flecks/redux.reducers`

> 
> Define root-level reducers for the Redux store.
>    

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/redux/src/store/create-reducer.js#L5'>@flecks/redux/src/store/create-reducer.js:5:17</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/redux.reducers': () => {
    return (state, action) => {
      // Whatever you'd like.
      return state;
    };
  }
};
```

## `@flecks/redux.slices`

> 
> Define Redux slices.
> 
> See: https://redux-toolkit.js.org/api/createSlice
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/react/src/router/index.js#L8'>@flecks/react/src/router/index.js:8:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/user/src/index.js#L8'>@flecks/user/src/index.js:8:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/redux/src/client/index.js#L9'>@flecks/redux/src/client/index.js:9:25</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/redux/src/server.js#L13'>@flecks/redux/src/server.js:13:25</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/redux.slices': () => {
    const something = createSlice(
      // ...
    );
    return {
      something: something.reducer,
    };
  }
};
```

## `@flecks/redux.store`

> 
> Modify Redux store configuration.

<details>
<summary>Parameters</summary>
<ul>
<li><strong><code>{Object}</code></strong> <code>options</code>
<blockquote>A mutable object with keys for enhancers and middleware.
   </blockquote></li>
</ul>
</details>

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/react/src/router/index.js#L11'>@flecks/react/src/router/index.js:11:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/redux/src/client/index.js#L17'>@flecks/redux/src/client/index.js:17:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/redux/src/store/index.js#L17'>@flecks/redux/src/store/index.js:17:2</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/redux.store': (options) => {
    options.enhancers.splice(someIndex, 1);
    options.middleware.push(mySpecialMiddleware);
  }
};
```

## `@flecks/repl.commands`

> 
> Define REPL commands.
> 
> Note: commands will be prefixed with a period in the Node REPL.
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/user/src/local/server/index.js#L31'>@flecks/user/src/local/server/index.js:31:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/repl/src/repl.js#L22'>@flecks/repl/src/repl.js:22:4</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/repl.commands': () => ({
    someCommand: (...args) => {
      // args are passed from the Node REPL. So, you could invoke it like:
      // .someCommand foo bar
      // and `args` would be `['foo', 'bar']`.
    },
  })
};
```

## `@flecks/repl.context`

> 
> Provide global context to the REPL.
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/db/src/server.js#L49'>@flecks/db/src/server.js:49:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/electron/src/server/index.js#L118'>@flecks/electron/src/server/index.js:118:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/redis/src/server.js#L40'>@flecks/redis/src/server.js:40:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/socket/src/server/index.js#L14'>@flecks/socket/src/server/index.js:14:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/web/src/server/index.js#L212'>@flecks/web/src/server/index.js:212:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/repl/src/repl.js#L14'>@flecks/repl/src/repl.js:14:18</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/repl.context': () => {
    // Now you'd be able to do like:
    // `node> someValue;`
    // and the REPL would evaluate it to `'foobar'`.
    return {
      someValue: 'foobar',
    };
  }
};
```

## `@flecks/server.up`

> 
> Define sequential actions to run when the server comes up.
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/db/src/server.js#L46'>@flecks/db/src/server.js:46:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/docker/src/server.js#L12'>@flecks/docker/src/server.js:12:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/repl/src/server.js#L6'>@flecks/repl/src/server.js:6:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/electron/src/server/index.js#L123'>@flecks/electron/src/server/index.js:123:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/governor/src/server.js#L57'>@flecks/governor/src/server.js:57:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/web/src/server/index.js#L211'>@flecks/web/src/server/index.js:211:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/user/src/local/server/index.js#L53'>@flecks/user/src/local/server/index.js:53:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/user/src/server/index.js#L34'>@flecks/user/src/server/index.js:34:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/user/src/session/server.js#L40'>@flecks/user/src/session/server.js:40:2</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/server.up': async () => {
    await youCanDoAsyncThingsHere();
  }
};
```

## `@flecks/socket.client`

> 
> Modify Socket.io client configuration.
> 
> See: https://socket.io/docs/v4/client-options/
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/socket/src/client/index.js#L10'>@flecks/socket/src/client/index.js:10:2</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/socket.client': () => ({
    timeout: Infinity,
  })
};
```

## `@flecks/socket.intercom`

> 
> Define server-side intercom channels.
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/user/src/server/index.js#L46'>@flecks/user/src/server/index.js:46:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/socket/src/server/sockets.js#L18'>@flecks/socket/src/server/sockets.js:18:18</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/socket.intercom': (req) => ({
    // This would have been called like:
    // `const result = await req.intercom('someChannel', payload)`.
    // `result` will be an `n`-length array, where `n` is the number of server instances. Each
    // element in the array will be the result of `someServiceSpecificInformation()` running
    // against that server instance.
    someChannel: async (payload, server) => {
      return someServiceSpecificInformation();
    },
  })
};
```

## `@flecks/socket.packets`

> 
> Define socket packets.
> 
> In the example below, your fleck would have a `packets` subdirectory, and each
> decorator would be defined in its own file.
> See: https://github.com/cha0s/flecks/tree/master/packages/redux/src/packets
> 
> See: https://github.com/cha0s/flecks/tree/master/packages/socket/src/packet/packet.js
> See: https://github.com/cha0s/flecks/tree/master/packages/socket/src/packet/redirect.js
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/socket/src/index.js#L27'>@flecks/socket/src/index.js:27:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/redux/src/index.js#L9'>@flecks/redux/src/index.js:9:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/user/src/index.js#L12'>@flecks/user/src/index.js:12:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/socket/src/index.js#L12'>@flecks/socket/src/index.js:12:41</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/socket.packets': Flecks.provide(require.context('./packets', false, /\.js$/))
};
```

## `@flecks/socket.packets.decorate`

> 
> Decorate database models.
> 
> In the example below, your fleck would have a `packets/decorators` subdirectory, and each
> decorator would be defined in its own file.

<details>
<summary>Parameters</summary>
<ul>
<li><strong><code>{constructor}</code></strong> <code>Packet</code>
<blockquote>The packet to decorate.
   </blockquote></li>
</ul>
</details>

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/governor/src/server.js#L125'>@flecks/governor/src/server.js:125:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/redux/src/client/index.js#L21'>@flecks/redux/src/client/index.js:21:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/socket/src/index.js#L12'>@flecks/socket/src/index.js:12:41</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/socket.packets.decorate': Flecks.decorate(require.context('./packets/decorators', false, /\.js$/))
};
```

## `@flecks/socket.server`

> 
> Modify Socket.io server configuration.
> 
> See: https://socket.io/docs/v4/server-options/
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/redis/src/session/server.js#L21'>@flecks/redis/src/session/server.js:21:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/socket/src/server/index.js#L18'>@flecks/socket/src/server/index.js:18:2</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/socket.server': () => ({
    pingTimeout: Infinity,
  })
};
```

## `@flecks/socket/server.request.socket`

> 
> Define middleware to run when a socket connection is established.
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/governor/src/server.js#L98'>@flecks/governor/src/server.js:98:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/user/src/server/index.js#L60'>@flecks/user/src/server/index.js:60:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/user/src/session/server.js#L49'>@flecks/user/src/session/server.js:49:2</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/socket/server.request.socket': () => (socket, next) => {
    // Express-style route middleware...
    next();
  }
};
```

## `@flecks/user.session`

> 
> Modify express-session configuration.
> 
> See: https://www.npmjs.com/package/express-session
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/redis/src/session/server.js#L14'>@flecks/redis/src/session/server.js:14:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/user/src/session/server.js#L46'>@flecks/user/src/session/server.js:46:15</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/user.session': () => ({
    saveUninitialized: true,
  })
};
```

## `@flecks/web.config`

> 
> Override flecks configuration sent to client flecks.

<details>
<summary>Parameters</summary>
<ul>
<li><strong><code>{http.ClientRequest}</code></strong> <code>req</code>
<blockquote>The HTTP request object.
   </blockquote></li>
</ul>
</details>

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/socket/src/index.js#L17'>@flecks/socket/src/index.js:17:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/redux/src/server.js#L28'>@flecks/redux/src/server.js:28:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/web/src/server/config.js#L4'>@flecks/web/src/server/config.js:4:27</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/web.config': (req) => ({
    someClientFleck: {
      someConfig: req.someConfig,
    },
  })
};
```

## `@flecks/web.routes`

> 
> Define HTTP routes.
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/web/src/server/index.js#L200'>@flecks/web/src/server/index.js:200:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/user/src/local/server/index.js#L21'>@flecks/user/src/local/server/index.js:21:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/user/src/server/index.js#L24'>@flecks/user/src/server/index.js:24:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/web/src/server/http.js#L42'>@flecks/web/src/server/http.js:42:25</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/web.routes': () => [
    {
      method: 'get',
      path: '/some-path',
      middleware: (req, res, next) => {
        // Express-style route middleware...
        next();
      },
    },
  ]
};
```

## `@flecks/web/client.up`

> 
> Define sequential actions to run when the client comes up.
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/react/src/client.js#L14'>@flecks/react/src/client.js:14:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/socket/src/client/index.js#L4'>@flecks/socket/src/client/index.js:4:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/web/src/server/build/entry.js#L60'>@flecks/web/src/server/build/entry.js:60:10</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/web/client.up': async () => {
    await youCanDoAsyncThingsHere();
  }
};
```

## `@flecks/web/server.request.route`

> 
> Define middleware to run when a route is matched.
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/governor/src/server.js#L28'>@flecks/governor/src/server.js:28:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/redux/src/server.js#L12'>@flecks/redux/src/server.js:12:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/user/src/server/index.js#L10'>@flecks/user/src/server/index.js:10:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/user/src/session/server.js#L19'>@flecks/user/src/session/server.js:19:2</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/web/server.request.route': () => (req, res, next) => {
    // Express-style route middleware...
    next();
  }
};
```

## `@flecks/web/server.request.socket`

> 
> Define middleware to run when an HTTP socket connection is established.
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/socket/src/server/index.js#L5'>@flecks/socket/src/server/index.js:5:2</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/web/server.request.socket': () => (req, res, next) => {
    // Express-style route middleware...
    next();
  }
};
```

## `@flecks/web/server.stream.html`

> 
> Define composition functions to run over the HTML stream prepared for the client.

<details>
<summary>Parameters</summary>
<ul>
<li><strong><code>{stream.Readable}</code></strong> <code>stream</code>
<blockquote>The HTML stream.</blockquote></li>
<li><strong><code>{http.ClientRequest}</code></strong> <code>req</code>
<blockquote>The HTTP request object.
   </blockquote></li>
</ul>
</details>

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/react/src/server.js#L18'>@flecks/react/src/server.js:18:2</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/web/src/server/index.js#L210'>@flecks/web/src/server/index.js:210:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/web/src/server/http.js#L19'>@flecks/web/src/server/http.js:19:2</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/web/server.stream.html': (stream, req) => {
    return stream.pipe(myTransformStream);
  }
};
```

## `@flecks/web/server.up`

> 
> Define sequential actions to run when the HTTP server comes up.
>    

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/socket/src/server/index.js#L9'>@flecks/socket/src/server/index.js:9:2</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/5e20e60/packages/web/src/server/http.js#L121'>@flecks/web/src/server/http.js:121:24</a></li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/web/server.up': async () => {
    await youCanDoAsyncThingsHere();
  }
};
```
