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
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/core/src/server/index.js#L22'>@flecks/core/src/server/index.js:22:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/core/src/server/build/eslintrc.js#L19'>@flecks/core/src/server/build/eslintrc.js:19:0</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/core/src/server/build/webpack.config.js#L55'>@flecks/core/src/server/build/webpack.config.js:55:6</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/core.build': (target, config) => {
      if ('something' === target) {
        config[target].use.push(someNeutrinoMiddleware);
      }
    }
  },
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
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/http/src/server/index.js#L11'>@flecks/http/src/server/index.js:11:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/core/src/server/build/webpack.config.js#L59'>@flecks/core/src/server/build/webpack.config.js:59:20</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/core.build.alter': (configs) => {
      // Maybe we want to do something if a config exists..?
      if (configs.something) {
        // Do something...
        // And then maybe we want to remove it from the build configuration..?
        delete configs.something;
      }
    }
  },
};
```

## `@flecks/core.build.config`

> 
> Register build configuration.
>       

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/core/src/server/index.js#L41'>@flecks/core/src/server/index.js:41:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/http/src/server/index.js#L39'>@flecks/http/src/server/index.js:39:4</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
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
  },
};
```

## `@flecks/core.commands`

> 
> Define CLI commands.
>       

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/docker/src/server.js#L14'>@flecks/docker/src/server.js:14:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/dox/src/server.js#L7'>@flecks/dox/src/server.js:7:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/repl/src/server.js#L8'>@flecks/repl/src/server.js:8:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/core/src/server/index.js#L64'>@flecks/core/src/server/index.js:64:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/fleck/src/server/index.js#L7'>@flecks/fleck/src/server/index.js:7:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/core/src/cli.js#L91'>@flecks/core/src/cli.js:91:21</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
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
        description: 'This sure is some command',
        options: [
          '-t, --test', 'Do a test',
          '-b, --blow-up', 'Blow up instead of running the command',
        ],
      },
    })
  },
};
```

## `@flecks/core.config`

> 
> Define configuration.
>       

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/db/src/server.js#L14'>@flecks/db/src/server.js:14:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/docker/src/server.js#L8'>@flecks/docker/src/server.js:8:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/dox/src/server.js#L8'>@flecks/dox/src/server.js:8:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/governor/src/server.js#L10'>@flecks/governor/src/server.js:10:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/react/src/index.js#L18'>@flecks/react/src/index.js:18:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/redis/src/server.js#L32'>@flecks/redis/src/server.js:32:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/core/src/index.js#L18'>@flecks/core/src/index.js:18:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/core/src/server/index.js#L65'>@flecks/core/src/server/index.js:65:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/http/src/server/index.js#L47'>@flecks/http/src/server/index.js:47:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/server/src/index.js#L5'>@flecks/server/src/index.js:5:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/user/src/local/server/index.js#L9'>@flecks/user/src/local/server/index.js:9:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/user/src/session/server.js#L9'>@flecks/user/src/session/server.js:9:4</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/core.config': () => ({
      whatever: 'configuration',
      your: 1337,
      fleck: 'needs',
      though: 'you should keep the values serializable',
    })
  },
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
export default {
  [Hooks]: {
    '@flecks/core.hmr': (path, updatedFleck) => {
      if ('my-fleck' === path) {
        updatedFleck.doSomething();
      }
    }
  },
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
export default {
  [Hooks]: {
    '@flecks/core.hmr.gathered': (Class, hook) => {
      // Do something with Class...
    }
  },
};
```

## `@flecks/core.starting`

> 
> Invoked when the application is starting. Use for order-independent initialization tasks.
>       

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/db/src/server.js#L42'>@flecks/db/src/server.js:42:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/socket/src/index.js#L13'>@flecks/socket/src/index.js:13:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/http/src/server/index.js#L83'>@flecks/http/src/server/index.js:83:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/http/src/entry.js#L27'>@flecks/http/src/entry.js:27:10</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/server/src/entry.js#L27'>@flecks/server/src/entry.js:27:10</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/core.starting': (flecks) => {
      flecks.set('$my-fleck/value', initializeMyValue());
    }
  },
};
```

## `@flecks/core.targets`

> 
> Define neutrino build targets.
>       

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/fleck/src/server/index.js#L8'>@flecks/fleck/src/server/index.js:8:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/http/src/server/index.js#L89'>@flecks/http/src/server/index.js:89:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/server/src/server/index.js#L5'>@flecks/server/src/server/index.js:5:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/core/src/server/build/webpack.config.js#L38'>@flecks/core/src/server/build/webpack.config.js:38:24</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/core/src/server/commands.js#L47'>@flecks/core/src/server/commands.js:47:33</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/core/src/server/commands.js#L94'>@flecks/core/src/server/commands.js:94:26</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/core.targets': () => ['sometarget']
  },
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
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/core/src/server/build/webpack.config.js#L64'>@flecks/core/src/server/build/webpack.config.js:64:14</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/core.webpack': (target, config) => {
      if ('something' === target) {
        config.stats = 'verbose';
      }
    }
  },
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
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/governor/src/server.js#L28'>@flecks/governor/src/server.js:28:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/user/src/server/index.js#L9'>@flecks/user/src/server/index.js:9:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/db/src/server.js#L43'>@flecks/db/src/server.js:43:38</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/db/server.models': Flecks.provide(require.context('./models', false, /\.js$/))
  },
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
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/user/src/local/server/index.js#L19'>@flecks/user/src/local/server/index.js:19:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/db/src/server.js#L43'>@flecks/db/src/server.js:43:38</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/db/server.models.decorate': Flecks.decorate(require.context('./models/decorators', false, /\.js$/))
  },
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
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/db/src/server.js#L48'>@flecks/db/src/server.js:48:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/redis/src/server.js#L42'>@flecks/redis/src/server.js:42:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/docker/src/commands.js#L51'>@flecks/docker/src/commands.js:51:25</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/docker/src/server.js#L19'>@flecks/docker/src/server.js:19:31</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
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
  },
};
```

## `@flecks/fleck.compiler`

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/fleck/src/server/build/fleck.neutrinorc.js#L22'>@flecks/fleck/src/server/build/fleck.neutrinorc.js:22:19</a></li>
</ul>
</details>

## `@flecks/http.config`

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
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/socket/src/index.js#L19'>@flecks/socket/src/index.js:19:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/redux/src/server.js#L24'>@flecks/redux/src/server.js:24:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/http/src/server/config.js#L4'>@flecks/http/src/server/config.js:4:27</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/http.config': (req) => ({
      someClientFleck: {
        someConfig: req.someConfig,
      },
    })
  },
};
```

## `@flecks/http.routes`

> 
> Define HTTP routes.
>      

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/http/src/server/index.js#L90'>@flecks/http/src/server/index.js:90:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/user/src/local/server/index.js#L22'>@flecks/user/src/local/server/index.js:22:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/user/src/server/index.js#L24'>@flecks/user/src/server/index.js:24:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/http/src/server/http.js#L42'>@flecks/http/src/server/http.js:42:25</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/http.routes': () => [
      {
        method: 'get',
        path: '/some-path',
        middleware: (req, res, next) => {
          // Express-style route middleware...
          next();
        },
      },
    ]
  },
};
```

## `@flecks/http/client.up`

> 
> Define sequential actions to run when the client comes up.
>      

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/react/src/client.js#L15'>@flecks/react/src/client.js:15:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/socket/src/client/index.js#L7'>@flecks/socket/src/client/index.js:7:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/http/src/entry.js#L27'>@flecks/http/src/entry.js:27:10</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/http/client.up': async () => {
      await youCanDoAsyncThingsHere();
    }
  },
};
```

## `@flecks/http/server.compiler`

> 
> Define neutrino compilation middleware (e.g. @neutrinojs/react).
>      

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/react/src/server.js#L8'>@flecks/react/src/server.js:8:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/http/src/server/build/http.neutrinorc.js#L39'>@flecks/http/src/server/build/http.neutrinorc.js:39:19</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/http/server.compiler': () => {
      return require('@neutrinojs/node');
    }
  },
};
```

## `@flecks/http/server.request.route`

> 
> Define middleware to run when a route is matched.
>      

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/governor/src/server.js#L29'>@flecks/governor/src/server.js:29:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/redux/src/server.js#L12'>@flecks/redux/src/server.js:12:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/user/src/server/index.js#L10'>@flecks/user/src/server/index.js:10:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/user/src/session/server.js#L19'>@flecks/user/src/session/server.js:19:4</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/http/server.request.route': () => (req, res, next) => {
      // Express-style route middleware...
      next();
    }
  },
};
```

## `@flecks/http/server.request.socket`

> 
> Define middleware to run when an HTTP socket connection is established.
>      

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/socket/src/server/index.js#L8'>@flecks/socket/src/server/index.js:8:4</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/http/server.request.socket': () => (req, res, next) => {
      // Express-style route middleware...
      next();
    }
  },
};
```

## `@flecks/http/server.stream.html`

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
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/react/src/server.js#L26'>@flecks/react/src/server.js:26:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/http/src/server/index.js#L100'>@flecks/http/src/server/index.js:100:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/http/src/server/http.js#L19'>@flecks/http/src/server/http.js:19:2</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/http/server.stream.html': (stream, req) => {
      return stream.pipe(myTransformStream);
    }
  },
};
```

## `@flecks/http/server.up`

> 
> Define sequential actions to run when the HTTP server comes up.
>      

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/socket/src/server/index.js#L12'>@flecks/socket/src/server/index.js:12:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/http/src/server/http.js#L120'>@flecks/http/src/server/http.js:120:24</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/http/server.up': async () => {
      await youCanDoAsyncThingsHere();
    }
  },
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
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/react/src/router/client.js#L9'>@flecks/react/src/router/client.js:9:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/react/src/router/server.js#L6'>@flecks/react/src/router/server.js:6:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/redux/src/client/index.js#L9'>@flecks/redux/src/client/index.js:9:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/redux/src/server.js#L29'>@flecks/redux/src/server.js:29:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/react/src/root.js#L12'>@flecks/react/src/root.js:12:26</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/react.providers': (req) => {
      // Generally it makes more sense to separate client and server concerns using platform
      // naming conventions, but this is just a small contrived example.
      return req ? serverSideProvider(req) : clientSideProvider();
    }
  },
};
```

## `@flecks/react.roots`

> 
> Define root-level React components that are mounted as siblings on `#main`.
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
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/react/src/root.js#L10'>@flecks/react/src/root.js:10:16</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/react.roots': (req) => {
      // Note that we're not returning `<Component />`, but `Component`.
      return Component;
    }
  },
};
```

## `@flecks/redux.effects`

> 
> Define side-effects to run against Redux actions.
>      

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/redux/src/store/middleware/effects.js#L2'>@flecks/redux/src/store/middleware/effects.js:2:18</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/redux.effects': () => ({
      someActionName: (store, action, flecks) => {
        // Runs when `someActionName` actions are dispatched.
      },
    })
  },
};
```

## `@flecks/redux.reducers`

> 
> Define root-level reducers for the Redux store.
>      

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/redux/src/store/create-reducer.js#L5'>@flecks/redux/src/store/create-reducer.js:5:17</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/redux.reducers': () => {
      return (state, action) => {
        // Whatever you'd like.
        return state;
      };
    }
  },
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
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/react/src/router/index.js#L10'>@flecks/react/src/router/index.js:10:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/user/src/index.js#L13'>@flecks/user/src/index.js:13:4</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/redux.slices': () => {
      const something = createSlice(
        // ...
      );
      return {
        something: something.reducer,
      };
    }
  },
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
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/react/src/router/index.js#L13'>@flecks/react/src/router/index.js:13:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/redux/src/client/index.js#L18'>@flecks/redux/src/client/index.js:18:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/redux/src/store/index.js#L17'>@flecks/redux/src/store/index.js:17:2</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/redux.store': (options) => {
      options.enhancers.splice(someIndex, 1);
      options.middleware.push(mySpecialMiddleware);
    }
  },
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
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/user/src/local/server/index.js#L32'>@flecks/user/src/local/server/index.js:32:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/repl/src/repl.js#L21'>@flecks/repl/src/repl.js:21:4</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/repl.commands': () => ({
      someCommand: (...args) => {
        // args are passed from the Node REPL. So, you could invoke it like:
        // .someCommand foo bar
        // and `args` would be `['foo', 'bar']`.
      },
    })
  },
};
```

## `@flecks/repl.context`

> 
> Provide global context to the REPL.
>      

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/db/src/server.js#L52'>@flecks/db/src/server.js:52:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/redis/src/server.js#L43'>@flecks/redis/src/server.js:43:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/socket/src/server/index.js#L17'>@flecks/socket/src/server/index.js:17:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/http/src/server/index.js#L102'>@flecks/http/src/server/index.js:102:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/repl/src/repl.js#L13'>@flecks/repl/src/repl.js:13:18</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/repl.context': () => {
      // Now you'd be able to do like:
      // `node> someValue;`
      // and the REPL would evaluate it to `'foobar'`.
      return {
        someValue: 'foobar',
      };
    }
  },
};
```

## `@flecks/server.compiler`

> 
> Define neutrino compilation middleware (e.g. @neutrinojs/react).
>      

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/server/src/server/build/server.neutrinorc.js#L66'>@flecks/server/src/server/build/server.neutrinorc.js:66:19</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/server.compiler': () => {
      return require('@neutrinojs/node');
    }
  },
};
```

## `@flecks/server.up`

> 
> Define sequential actions to run when the server comes up.
>      

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/db/src/server.js#L49'>@flecks/db/src/server.js:49:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/docker/src/server.js#L15'>@flecks/docker/src/server.js:15:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/repl/src/server.js#L9'>@flecks/repl/src/server.js:9:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/governor/src/server.js#L58'>@flecks/governor/src/server.js:58:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/http/src/server/index.js#L101'>@flecks/http/src/server/index.js:101:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/user/src/local/server/index.js#L54'>@flecks/user/src/local/server/index.js:54:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/user/src/server/index.js#L34'>@flecks/user/src/server/index.js:34:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/user/src/session/server.js#L40'>@flecks/user/src/session/server.js:40:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/server/src/entry.js#L27'>@flecks/server/src/entry.js:27:10</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/server.up': async () => {
      await youCanDoAsyncThingsHere();
    }
  },
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
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/socket/src/client/index.js#L13'>@flecks/socket/src/client/index.js:13:4</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/socket.client': () => ({
      timeout: Infinity,
    })
  },
};
```

## `@flecks/socket.intercom`

> 
> Define server-side intercom channels.
>      

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/user/src/server/index.js#L46'>@flecks/user/src/server/index.js:46:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/socket/src/server/sockets.js#L17'>@flecks/socket/src/server/sockets.js:17:18</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
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
  },
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
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/socket/src/index.js#L29'>@flecks/socket/src/index.js:29:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/redux/src/index.js#L10'>@flecks/redux/src/index.js:10:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/user/src/index.js#L17'>@flecks/user/src/index.js:17:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/socket/src/index.js#L14'>@flecks/socket/src/index.js:14:43</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/socket.packets': Flecks.provide(require.context('./packets', false, /\.js$/))
  },
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
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/governor/src/server.js#L126'>@flecks/governor/src/server.js:126:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/redux/src/client/index.js#L22'>@flecks/redux/src/client/index.js:22:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/socket/src/index.js#L14'>@flecks/socket/src/index.js:14:43</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/socket.packets.decorate': Flecks.decorate(require.context('./packets/decorators', false, /\.js$/))
  },
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
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/redis/src/session/server.js#L21'>@flecks/redis/src/session/server.js:21:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/socket/src/server/index.js#L21'>@flecks/socket/src/server/index.js:21:4</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/socket.server': () => ({
      pingTimeout: Infinity,
    })
  },
};
```

## `@flecks/socket/server.request.socket`

> 
> Define middleware to run when a socket connection is established.
>      

<details>
<summary>Implementations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/governor/src/server.js#L99'>@flecks/governor/src/server.js:99:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/user/src/server/index.js#L60'>@flecks/user/src/server/index.js:60:4</a></li>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/user/src/session/server.js#L49'>@flecks/user/src/session/server.js:49:4</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/socket/server.request.socket': () => (socket, next) => {
      // Express-style route middleware...
      next();
    }
  },
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
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/redis/src/session/server.js#L14'>@flecks/redis/src/session/server.js:14:4</a></li>
</ul>
</details>

<details>
<summary>Invocations</summary>
<ul>
<li><a href='https://github.com/cha0s/flecks/tree/9317304/packages/user/src/session/server.js#L46'>@flecks/user/src/session/server.js:46:17</a></li>
</ul>
</details>

### Example usage

```javascript
export default {
  [Hooks]: {
    '@flecks/user.session': () => ({
      saveUninitialized: true,
    })
  },
};
```
