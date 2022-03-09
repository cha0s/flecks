module.exports = (api) => {
  api.cache(true);
  return {
    plugins: [
      '@babel/plugin-proposal-optional-chaining',
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          exclude: [
            '@babel/plugin-transform-regenerator',
          ],
        },
      ],
    ],
  };
};
