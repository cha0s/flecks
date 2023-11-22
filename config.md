# Configuration

This page documents all the configuration in this project.

```javascript
'@flecks/core': {
  // The ID of your application.
  id:   'flecks'
}
```
```javascript
'@flecks/core/server': {
  // Build targets to exclude from ESLint.
  eslint.exclude:   []
  // Build targets to profile with `webpack.debug.ProfilingPlugin`.
  profile:   []
}
```
```javascript
'@flecks/db/server': {
  // The database to connect to.
  database:   ':memory:'
  // SQL dialect. See: https://sequelize.org/v5/manual/dialects.html
  dialect:   'sqlite'
  // Database server host.
  host:   undefined
  // Database server password.
  password:   undefined
  // Database server port.
  port:   undefined
  // Database server username.
  username:   undefined
}
```
```javascript
'@flecks/docker/server': {
  // Whether to run docker containers.
  enabled:   true
}
```
```javascript
'@flecks/dox/server': {
  // Rewrite the output filenames of source files. `filename.replace(new RegExp([key]), [value]);`
  filenameRewriters:   {}
}
```
```javascript
'@flecks/electron/server': {
  // Browser window options. See: https://www.electronjs.org/docs/latest/api/browser-window
  browserWindowOptions:   {}
  // Install devtools extensions (by default). If `true`, will install some devtools extensions based on which flecks are enabled. You can pass an array of Chrome store IDs to install a list of custom extensions. Extensions will not be installed if `'production' === process.env.NODE_ENV`
  installExtensions:   true
  // Quit the app when all windows are closed.
  quitOnClosed:   true
  // The URL to load in electron by default. Defaults to `http://${flecks.get('@flecks/web/server.public')}`.
  url:   undefined
}
```
```javascript
'@flecks/fleck/server': {
  // Webpack stats configuration when building fleck target.
  stats: {
    assetsSort: 'name',
    assetsSpace: Infinity,
    children: false,
    colors: true,
    excludeAssets: [/^(?:build|src|test)\//],
    groupAssetsByChunk: false,
    groupAssetsByEmitStatus: false,
    groupAssetsByExtension: false,
    groupAssetsByInfo: false,
    groupAssetsByPath: false,
    modules: false,
  }
}
```
```javascript
'@flecks/governor/server': {
  // All keys used to determine fingerprint.
  keys:   ['ip']
  // *No description provided.*
  web: {
    keys: ['ip'],
    points: 60,
    duration: 30,
    ttl: 30,
  }
  // *No description provided.*
  socket: {
    keys: ['ip'],
    points: 60,
    duration: 30,
    ttl: 30,
  }
}
```
```javascript
'@flecks/react': {
  // Whether to enable server-side rendering.
  ssr:   true
}
```
```javascript
'@flecks/redis/server': {
  // Redis server host.
  host:   'localhost'
  // Redis server port.
  port:   6379
}
```
```javascript
'@flecks/server': {
  // Whether HMR is enabled.
  hot:   false
  // Arguments to pass along to node. See: https://nodejs.org/api/cli.html
  nodeArgs:   []
  // Whether to start the server after building.
  start:   true
  // Webpack stats configuration when building server target.
  stats: {
    chunks: false,
    colors: true,
    modules: false,
  }
}
```
```javascript
'@flecks/user/local/server': {
  // Path to redirect to after failed login.
  failureRedirect:   '/'
  // Path to redirect to after successful login.
  successRedirect:   '/'
}
```
```javascript
'@flecks/user/session/server': {
  // Set the cookie secret for session encryption. See: http://expressjs.com/en/resources/middleware/cookie-parser.html
  cookieSecret:   'Set the FLECKS_ENV_FLECKS_USER_SESSION_SERVER_cookieSecret environment variable!'
}
```
```javascript
'@flecks/web/server': {
  // (webpack-dev-server) Disable the host check. See: https://github.com/webpack/webpack-dev-server/issues/887
  devDisableHostCheck:   false
  // (webpack-dev-server) Host to bind.
  devHost:   'localhost'
  // (webpack-dev-server) Port to bind.
  devPort:   undefined
  // (webpack-dev-server) Public path to serve. Defaults to `flecks.get('@flecks/web/server.public')`.
  devPublic:   undefined
  // (webpack-dev-server) Webpack stats output.
  devStats: {
    assets: false,
    chunks: false,
    colors: true,
    modules: false,
  }
  // Modules to externalize using `webpack.DllPlugin`.
  dll:   []
  // Force building http target even if there's a fleck target.
  forceBuildWithFleck:   false
  // Host to bind.
  host:   '0.0.0.0'
  // Build path.
  output:   'web'
  // Port to bind.
  port:   32340
  // Public path to server.
  public:   'localhost:32340'
  // Webpack stats configuration when building HTTP target.
  stats: {
    children: false,
    chunks: false,
    colors: true,
    modules: false,
  }
  // Proxies to trust. See: https://www.npmjs.com/package/proxy-addr
  trust:   false
}
```