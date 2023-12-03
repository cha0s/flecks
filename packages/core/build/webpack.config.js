const ESLintPlugin = require('eslint-webpack-plugin');

const configFn = require('../src/server/build/webpack.config');
const {executable} = require('../src/server/webpack');
const eslintConfigFn = require('../src/server/build/default.eslint.config');

const {
  FLECKS_CORE_ROOT = process.cwd(),
} = process.env;

module.exports = async (env, argv) => {
  const config = await configFn(env, argv);
  config.plugins.push(...executable());
  const eslint = await eslintConfigFn();
  eslint.settings['import/resolver'].webpack = {
    config: {
      resolve: config.resolve,
    },
  };
  config.plugins.push(
    new ESLintPlugin({
      cache: true,
      cwd: FLECKS_CORE_ROOT,
      emitWarning: argv.mode !== 'production',
      failOnError: argv.mode === 'production',
      useEslintrc: false,
      overrideConfig: eslint,
    }),
  );
  return config;
};
