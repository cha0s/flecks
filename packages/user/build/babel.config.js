const config = require('@flecks/core/build/babel.config');

module.exports = (api) => {
  const base = config(api);
  return {
    ...base,
    presets: [
      ...base.presets,
      '@babel/preset-react',
    ],
  };
};
