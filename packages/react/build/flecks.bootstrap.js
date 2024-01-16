const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const plugins = [];

const {
  FLECKS_CORE_IS_PRODUCTION,
} = process.env;

if ('true' !== FLECKS_CORE_IS_PRODUCTION) {
  plugins.push('react-refresh/babel');
}

exports.dependencies = ['@flecks/web'];

exports.hooks = {
  '@flecks/core.babel': () => ({
    plugins,
    presets: [
      '@babel/preset-react',
    ],
  }),
  '@flecks/core.build': (target, config, env, argv) => {
    const isProduction = 'production' === argv.mode;
    if (!isProduction) {
      config.plugins.push(new ReactRefreshWebpackPlugin());
    }
  },
  '@flecks/core.exts': () => ['.jsx'],
};
