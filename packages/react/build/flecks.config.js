const plugins = [];

const {
  FLECKS_CORE_IS_PRODUCTION,
} = process.env;

if ('true' !== FLECKS_CORE_IS_PRODUCTION) {
  plugins.push('react-refresh/babel');
}

module.exports = {
  babel: {
    plugins,
    presets: [
      '@babel/preset-react',
    ],
  },
  dependencies: ['@flecks/web'],
  exts: ['.jsx'],
};
