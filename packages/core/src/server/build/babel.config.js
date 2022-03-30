module.exports = (api) => {
  api.cache(true);
  return {
    assumptions: {
      ignoreFunctionLength: true,
      noClassCalls: true,
      noDocumentAll: true,
      objectRestNoSymbols: true,
      privateFieldsAsProperties: true,
      setSpreadProperties: true,
    },
    plugins: [
      '@babel/plugin-proposal-optional-chaining',
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          exclude: [
            '@babel/plugin-transform-regenerator',
            '@babel/plugin-transform-async-to-generator',
          ],
        },
      ],
    ],
  };
};
