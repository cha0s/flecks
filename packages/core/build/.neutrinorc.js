const {chmod} = require('fs');
const {join} = require('path');

const airbnb = require('@neutrinojs/airbnb');
const banner = require('@neutrinojs/banner');
const copy = require('@neutrinojs/copy');
const node = require('@neutrinojs/node');
const glob = require('glob');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

module.exports = require('../src/bootstrap/fleck.neutrinorc');

// Dotfiles.
module.exports.use.push((neutrino) => {
  ['eslintrc', 'eslint.defaults'].forEach((filename) => {
    neutrino.config
      .entry(`build/.${filename}`)
      .clear()
      .add(`./src/build/${filename}`);
  })
});

// Tests.
module.exports.use.push((neutrino) => {
  // Test entrypoint.
  const testPaths = glob.sync(join(FLECKS_CORE_ROOT, 'test/*.js'));
  testPaths.push(...glob.sync(join(FLECKS_CORE_ROOT, `test/platforms/server/*.js`)));
  if (testPaths.length > 0) {
    const testEntry = neutrino.config.entry('test').clear();
    testPaths.forEach((path) => testEntry.add(path));
  }
});

module.exports.use.unshift((neutrino) => {
  neutrino.config.plugins.delete('start-server');
});

module.exports.use.unshift(node({clean: {cleanStaleWebpackAssets: false}}));

module.exports.use.unshift(
  airbnb({
    eslint: {
      baseConfig: {
        ...require('../src/build/eslint.defaults'),
        env: {
          mocha: true,
        },
      },
    },
  }),
);

module.exports.use.push(banner({
  banner: '#!/usr/bin/env node',
  include: /^cli\.js$/,
  pluginId: 'shebang',
  raw: true,
}))

module.exports.use.push(({config}) => {
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
