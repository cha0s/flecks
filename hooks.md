# Hooks

This page documents all the hooks in this project.

## `@flecks/core.build`

> 
> Hook into neutrino configuration.

<details>
<summary>Parameters</summary>
<ul>
<li><strong><code>{string}</code></strong> <code>target</code>
<blockquote>The build target; e.g. `server`.</blockquote></li>
<li><strong><code>{Object}</code></strong> <code>config</code>
<blockquote>The neutrino configuration.
   </blockquote></li>
</ul>
</details>

<details>
<summary>Implementations</summary>
<ul>
<li>@flecks/electron/src/server/index.js:22:2</li>
<li>@flecks/react/src/server.js:6:2</li>
<li>@flecks/core/src/index.js:18:2</li>
<li>@flecks/core/src/server/index.js:34:2</li>
<li>@flecks/web/src/server/index.js:20:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/core/src/server/build/eslintrc.js:36:4</li>
<li>@flecks/core/src/server/build/webpack.config.js:56:6</li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/core.build': (target, config) => {
    if ('something' === target) {
      config[target].use.push(someNeutrinoMiddleware);
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
<blockquote>The neutrino configurations.
    </blockquote></li>
</ul>
</details>

<details>
<summary>Implementations</summary>
<ul>
<li>@flecks/web/src/server/index.js:21:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/core/src/server/build/webpack.config.js:60:20</li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/core.build.alter': (configs) => {
    // Maybe we want to do something if a config exists..?
    if (configs.something) {
      // Do something...
      // And then maybe we want to remove it from the build configuration..?
      delete configs.something;
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
<li>@flecks/core/src/server/index.js:74:2</li>
<li>@flecks/web/src/server/index.js:100:2</li>
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
<li>@flecks/docker/src/server.js:11:2</li>
<li>@flecks/dox/src/server.js:4:2</li>
<li>@flecks/repl/src/server.js:5:2</li>
<li>@flecks/core/src/server/index.js:97:2</li>
<li>@flecks/fleck/src/server/index.js:4:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/core/src/cli.js:92:21</li>
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
<li>@flecks/db/src/server.js:11:2</li>
<li>@flecks/docker/src/server.js:5:2</li>
<li>@flecks/dox/src/server.js:5:2</li>
<li>@flecks/electron/src/server/index.js:32:2</li>
<li>@flecks/governor/src/server.js:9:2</li>
<li>@flecks/react/src/index.js:16:2</li>
<li>@flecks/redis/src/server.js:29:2</li>
<li>@flecks/core/src/index.js:12:2</li>
<li>@flecks/core/src/server/index.js:98:2</li>
<li>@flecks/fleck/src/server/index.js:5:2</li>
<li>@flecks/server/src/index.js:2:2</li>
<li>@flecks/web/src/server/index.js:114:2</li>
<li>@flecks/user/src/local/server/index.js:8:2</li>
<li>@flecks/user/src/session/server.js:9:2</li>
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
<li>@flecks/db/src/server.js:39:2</li>
<li>@flecks/socket/src/index.js:11:2</li>
<li>@flecks/web/src/server/index.js:184:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/web/src/server/build/entry.js:59:22</li>
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
> Define neutrino build targets.
>     

<details>
<summary>Implementations</summary>
<ul>
<li>@flecks/fleck/src/server/index.js:16:2</li>
<li>@flecks/server/src/server/index.js:2:2</li>
<li>@flecks/web/src/server/index.js:193:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/core/src/server/build/webpack.config.js:39:24</li>
<li>@flecks/core/src/server/commands.js:49:33</li>
<li>@flecks/core/src/server/commands.js:96:26</li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/core.targets': () => ['sometarget']
};
```

## `@flecks/core.webpack`

> 
> Hook into webpack configuration.

<details>
<summary>Parameters</summary>
<ul>
<li><strong><code>{string}</code></strong> <code>target</code>
<blockquote>The build target; e.g. `server`.</blockquote></li>
<li><strong><code>{Object}</code></strong> <code>config</code>
<blockquote>The neutrino configuration.
    </blockquote></li>
</ul>
</details>

<details>
<summary>Implementations</summary>
<ul>
<li>@flecks/electron/src/server/index.js:60:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/core/src/server/build/webpack.config.js:66:16</li>
</ul>
</details>

### Example usage

```javascript
export const hooks = {
  '@flecks/core.webpack': (target, config) => {
    if ('something' === target) {
      config.stats = 'verbose';
    }
  }
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
<li>@flecks/governor/src/server.js:27:2</li>
<li>@flecks/user/src/server/index.js:9:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/db/src/server.js:40:36</li>
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
<li>@flecks/user/src/local/server/index.js:18:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/db/src/server.js:40:36</li>
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
<li>@flecks/db/src/server.js:45:2</li>
<li>@flecks/redis/src/server.js:39:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/docker/src/commands.js:51:25</li>
<li>@flecks/docker/src/server.js:16:29</li>
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
<li>@flecks/electron/src/server/index.js:86:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/electron/src/server/index.js:146:10</li>
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
<li>@flecks/electron/src/server/index.js:106:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/electron/src/server/index.js:18:8</li>
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
<li>@flecks/react/src/router/client.js:7:2</li>
<li>@flecks/react/src/router/server.js:4:2</li>
<li>@flecks/redux/src/client/index.js:8:2</li>
<li>@flecks/redux/src/server.js:33:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/react/src/root.js:15:26</li>
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
<li>@flecks/react/src/root.js:13:16</li>
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
<li>@flecks/redux/src/store/middleware/effects.js:2:18</li>
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
<li>@flecks/redux/src/store/create-reducer.js:5:17</li>
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
<li>@flecks/react/src/router/index.js:8:2</li>
<li>@flecks/user/src/index.js:8:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/redux/src/client/index.js:9:25</li>
<li>@flecks/redux/src/server.js:13:25</li>
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
<li>@flecks/react/src/router/index.js:11:2</li>
<li>@flecks/redux/src/client/index.js:17:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/redux/src/store/index.js:17:2</li>
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
<li>@flecks/user/src/local/server/index.js:31:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/repl/src/repl.js:22:4</li>
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
<li>@flecks/db/src/server.js:49:2</li>
<li>@flecks/electron/src/server/index.js:132:2</li>
<li>@flecks/socket/src/server/index.js:14:2</li>
<li>@flecks/redis/src/server.js:40:2</li>
<li>@flecks/web/src/server/index.js:209:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/repl/src/repl.js:14:18</li>
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
<li>@flecks/db/src/server.js:46:2</li>
<li>@flecks/docker/src/server.js:12:2</li>
<li>@flecks/repl/src/server.js:6:2</li>
<li>@flecks/electron/src/server/index.js:137:2</li>
<li>@flecks/governor/src/server.js:57:2</li>
<li>@flecks/web/src/server/index.js:208:2</li>
<li>@flecks/user/src/local/server/index.js:53:2</li>
<li>@flecks/user/src/server/index.js:34:2</li>
<li>@flecks/user/src/session/server.js:40:2</li>
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
<li>@flecks/socket/src/client/index.js:10:2</li>
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
<li>@flecks/user/src/server/index.js:46:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/socket/src/server/sockets.js:18:18</li>
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
<li>@flecks/socket/src/index.js:27:2</li>
<li>@flecks/redux/src/index.js:9:2</li>
<li>@flecks/user/src/index.js:12:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/socket/src/index.js:12:41</li>
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
<li>@flecks/governor/src/server.js:125:2</li>
<li>@flecks/redux/src/client/index.js:21:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/socket/src/index.js:12:41</li>
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
<li>@flecks/redis/src/session/server.js:21:2</li>
<li>@flecks/socket/src/server/index.js:18:2</li>
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
<li>@flecks/governor/src/server.js:98:2</li>
<li>@flecks/user/src/server/index.js:60:2</li>
<li>@flecks/user/src/session/server.js:49:2</li>
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
<li>@flecks/redis/src/session/server.js:14:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/user/src/session/server.js:46:15</li>
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
<li>@flecks/socket/src/index.js:17:2</li>
<li>@flecks/redux/src/server.js:28:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/web/src/server/config.js:4:27</li>
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
<li>@flecks/web/src/server/index.js:197:2</li>
<li>@flecks/user/src/local/server/index.js:21:2</li>
<li>@flecks/user/src/server/index.js:24:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/web/src/server/http.js:42:25</li>
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
<li>@flecks/react/src/client.js:14:2</li>
<li>@flecks/socket/src/client/index.js:4:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/web/src/server/build/entry.js:60:10</li>
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
<li>@flecks/governor/src/server.js:28:2</li>
<li>@flecks/redux/src/server.js:12:2</li>
<li>@flecks/user/src/server/index.js:10:2</li>
<li>@flecks/user/src/session/server.js:19:2</li>
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
<li>@flecks/socket/src/server/index.js:5:2</li>
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
<li>@flecks/react/src/server.js:22:2</li>
<li>@flecks/web/src/server/index.js:207:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/web/src/server/http.js:19:2</li>
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
<li>@flecks/socket/src/server/index.js:9:2</li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li>@flecks/web/src/server/http.js:120:24</li>
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
