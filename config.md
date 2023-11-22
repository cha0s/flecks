# Configuration

This page documents all the configuration in this project.

## `@flecks/core`

> *No description provided.*

```javascript
id: "flecks"
```

## `@flecks/core/server`

> *No description provided.*

```javascript
eslint.exclude: []
```

> *No description provided.*

```javascript
profile: []
```

## `@flecks/db/server`

> *No description provided.*

```javascript
database: ":memory:"
```

> *No description provided.*

```javascript
dialect: "sqlite"
```

> *No description provided.*

```javascript
host: void 0
```

> *No description provided.*

```javascript
password: void 0
```

> *No description provided.*

```javascript
port: void 0
```

> *No description provided.*

```javascript
username: void 0
```

## `@flecks/docker/server`

> *No description provided.*

```javascript
enabled: !0
```

## `@flecks/dox/server`

> *No description provided.*

```javascript
filenameRewriters: {}
```

## `@flecks/electron/server`

> *No description provided.*

```javascript
browserWindowOptions: {}
```

> *No description provided.*

```javascript
installExtensions: !0
```

> *No description provided.*

```javascript
quitOnClosed: !0
```

> *No description provided.*

```javascript
url: void 0
```

## `@flecks/fleck/server`

> *No description provided.*

```javascript
stats: {assetsSort:"name",assetsSpace:1/0,children:!1,colors:!0,excludeAssets:[/^(?:build|src|test)\//],groupAssetsByChunk:!1,groupAssetsByEmitStatus:!1,groupAssetsByExtension:!1,groupAssetsByInfo:!1,groupAssetsByPath:!1,modules:!1}
```

## `@flecks/governor/server`

> *No description provided.*

```javascript
keys: ["ip"]
```

> *No description provided.*

```javascript
web: {keys:["ip"],points:60,duration:30,ttl:30}
```

> *No description provided.*

```javascript
socket: {keys:["ip"],points:60,duration:30,ttl:30}
```

## `@flecks/react`

> *No description provided.*

```javascript
ssr: !0
```

## `@flecks/redis/server`

> *No description provided.*

```javascript
host: "localhost"
```

> *No description provided.*

```javascript
port: 6379
```

## `@flecks/server`

> *No description provided.*

```javascript
hot: !1
```

> *No description provided.*

```javascript
nodeArgs: []
```

> *No description provided.*

```javascript
start: !0
```

> *No description provided.*

```javascript
stats: {chunks:!1,colors:!0,modules:!1}
```

## `@flecks/user/local/server`

> *No description provided.*

```javascript
failureRedirect: "/"
```

> *No description provided.*

```javascript
successRedirect: "/"
```

## `@flecks/user/session/server`

> *No description provided.*

```javascript
cookieSecret: "Set the FLECKS_ENV_FLECKS_USER_SESSION_SERVER_cookieSecret environment variable!"
```

## `@flecks/web/server`

> *No description provided.*

```javascript
devDisableHostCheck: !1
```

> *No description provided.*

```javascript
devHost: "localhost"
```

> *No description provided.*

```javascript
devPort: void 0
```

> *No description provided.*

```javascript
devPublic: void 0
```

> *No description provided.*

```javascript
devStats: {assets:!1,chunks:!1,colors:!0,modules:!1}
```

> *No description provided.*

```javascript
dll: []
```

> *No description provided.*

```javascript
forceBuildWithFleck: !1
```

> *No description provided.*

```javascript
host: "0.0.0.0"
```

> *No description provided.*

```javascript
output: "web"
```

> *No description provided.*

```javascript
port: 32340
```

> *No description provided.*

```javascript
public: "localhost:32340"
```

> *No description provided.*

```javascript
stats: {children:!1,chunks:!1,colors:!0,modules:!1}
```

> *No description provided.*

```javascript
trust: !1
```
