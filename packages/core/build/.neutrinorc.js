const {chmod} = require('fs');
const {join} = require('path');

const airbnb = require('@neutrinojs/airbnb');
const banner = require('@neutrinojs/banner');
const copy = require('@neutrinojs/copy');
const glob = require('glob');

const fleck = require('../src/bootstrap/fleck');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

const config = require('../src/bootstrap/fleck.neutrinorc');

// Dotfiles.
config.use.push(({config}) => {
  ['eslintrc'].forEach((filename) => {
    config
      .entry(`server/build/.${filename}`)
      .clear()
      .add(`./src/server/build/${filename}`);
  })
});

// Tests.
config.use.push(({config}) => {
  // Test entrypoint.
  const testPaths = glob.sync(join(FLECKS_CORE_ROOT, 'test/*.js'));
  testPaths.push(...glob.sync(join(FLECKS_CORE_ROOT, `test/platforms/server/*.js`)));
  if (testPaths.length > 0) {
    const testEntry = config.entry('test').clear();
    testPaths.forEach((path) => testEntry.add(path));
  }
});

// Fleck build configuration.
config.use.unshift(fleck());

// AirBnb linting.
config.use.unshift(
  airbnb({
    eslint: {
      baseConfig: require('../src/server/build/.eslint.defaults'),
    },
  }),
);

// Include a shebang and set the executable bit..
config.use.push(banner({
  banner: '#!/usr/bin/env node',
  include: /^cli\.js$/,
  pluginId: 'shebang',
  raw: true,
}))
config.use.push(({config}) => {
  config
    .plugin('executable')
      .use(class Executable {

        apply(compiler) {
          compiler.hooks.afterEmit.tapAsync(
            'Executable',
            (compilation, callback) => {
              chmod(join(__dirname, '..', 'dist', 'cli.js'), 0o755, callback);
            },
          )
        }

      });
});

module.exports = config;
