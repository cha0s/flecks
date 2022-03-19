# Configuration

This page documents all the configuration in this project.

## `@flecks/core`

> The ID of your application.

```javascript
id: 'flecks'
```

## `@flecks/core/server`

> Build targets to exclude from ESLint.

```javascript
eslint.exclude: []
```

> Build targets to profile with `webpack.debug.ProfilingPlugin`.

```javascript
profile: []
```

## `@flecks/db/server`

> The database to connect to.

```javascript
database: ':memory:'
```

> SQL dialect. See: https://sequelize.org/v5/manual/dialects.html

```javascript
dialect: 'sqlite'
```

> Database server host.

```javascript
host: undefined
```

> Database server password.

```javascript
password: undefined
```

> Database server port.

```javascript
port: undefined
```

> Database server username.

```javascript
username: undefined
```

## `@flecks/docker/server`

> Whether to run docker containers.

```javascript
enabled: true
```

## `@flecks/dox/server`

> Rewrite the output filenames of source files. `filename.replace(new RegExp([key]), [value]);`

```javascript
filenameRewriters: {}
```

## `@flecks/fleck/server`

> Webpack stats configuration when building fleck target.

```javascript
stats: {
        children: false,
        chunks: false,
        colors: true,
        modules: false,
      }
```

## `@flecks/governor/server`

> All keys used to determine fingerprint.

```javascript
keys: ['ip']
```

> *No description provided.*

```javascript
http: {
        keys: ['ip'],
        points: 60,
        duration: 30,
        ttl: 30,
      }
```

> *No description provided.*

```javascript
socket: {
        keys: ['ip'],
        points: 60,
        duration: 30,
        ttl: 30,
      }
```

## `@flecks/react`

> Whether to enable server-side rendering.

```javascript
ssr: true
```

## `@flecks/redis/server`

> Redis server host.

```javascript
host: 'localhost'
```

> Redis server port.

```javascript
port: 6379
```

## `@flecks/server`

> Whether HMR is enabled.

```javascript
hot: false
```

> Whether the Node.js inspector is enabled.

```javascript
inspect: false
```

> Whether Node.js profiling is enabled.

```javascript
profile: false
```

> Whether to start the server after building.

```javascript
start: true
```

> Webpack stats configuration when building server target.

```javascript
stats: {
        chunks: false,
        colors: true,
        modules: false,
      }
```

## `@flecks/user/local/server`

> Path to redirect to after failed login.

```javascript
failureRedirect: '/'
```

> Path to redirect to after successful login.

```javascript
successRedirect: '/'
```

## `@flecks/user/session/server`

> Set the cookie secret for session encryption. See: http://expressjs.com/en/resources/middleware/cookie-parser.html

```javascript
cookieSecret: 'Set the FLECKS_ENV_FLECKS_USER_SESSION_SERVER_cookieSecret environment variable!'
```

## `@flecks/web/server`

> (webpack-dev-server) Host to bind.

```javascript
devHost: 'localhost'
```

> (webpack-dev-server) Port to bind.

```javascript
devPort: undefined
```

> (webpack-dev-server) Public path to serve.

```javascript
devPublic: undefined
```

> (webpack-dev-server) Webpack stats output.

```javascript
devStats: {
        chunks: false,
        colors: true,
        modules: false,
      }
```

> Modules to externalize using `webpack.DllPlugin`.

```javascript
dll: []
```

> Force building http target even if there's a fleck target.

```javascript
forceBuildWithFleck: false
```

> Host to bind.

```javascript
host: '0.0.0.0'
```

> Build path.

```javascript
output: 'http'
```

> Port to bind.

```javascript
port: 32340
```

> Webpack stats configuration when building HTTP target.

```javascript
stats: {
        children: false,
        chunks: false,
        colors: true,
        modules: false,
      }
```

> Proxies to trust. See: https://www.npmjs.com/package/proxy-addr

```javascript
trust: false
```
