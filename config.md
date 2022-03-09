# Configuration

This page documents all the configuration in this project.

## `@flecks/core`

> *No description provided.*

```javascript
id: 'flecks'
```

## `@flecks/core/server`

> *No description provided.*

```javascript
eslint.exclude: []
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

## `@flecks/http/server`

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
devStats: 'minimal'
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

> Proxies to trust. See: https://www.npmjs.com/package/proxy-addr

```javascript
trust: false
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

> Whether the Node inspector is enabled.

```javascript
inspect: false
```

> Whether node profiling is enabled.

```javascript
profile: false
```

> Whether to start the server after building.

```javascript
start: false
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
