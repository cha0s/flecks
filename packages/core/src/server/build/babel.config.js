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
      '@babel/plugin-syntax-class-properties',
      '@babel/plugin-syntax-logical-assignment-operators',
      '@babel/plugin-syntax-nullish-coalescing-operator',
      '@babel/plugin-syntax-optional-chaining',
    ],
    presets: [
      [
        '@babel/preset-env',
        {
          exclude: [
            '@babel/plugin-transform-regenerator',
            '@babel/plugin-transform-async-to-generator',
            '@babel/plugin-transform-object-super',
          ],
        },
      ],
    ],
  };
};
