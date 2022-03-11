module.exports = (api) => {
  api.cache(true);
  return {
    assumptions: {
      constantSuper: true,
      ignoreFunctionLength: true,
      noClassCalls: true,
      noDocumentAll: true,
      objectRestNoSymbols: true,
      privateFieldsAsProperties: true,
      setClassMethods: true,
      setComputedProperties: true,
      setPublicClassFields: true,
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
          ],
        },
      ],
    ],
  };
};
