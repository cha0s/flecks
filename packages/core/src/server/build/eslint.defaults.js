module.exports = {
  globals: {
    __non_webpack_require__: true,
    window: true,
  },
  ignorePatterns: [
    '**/dist/**',
    'build/dox/hooks.js',
  ],
  overrides: [
    {
      files: [
        'test/**/*.js',
      ],
      rules: {
        'babel/no-unused-expressions': 'off',
        'brace-style': 'off',
        'class-methods-use-this': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'off',
        'max-classes-per-file': 'off',
        'no-new': 'off',
        'padded-blocks': 'off',
      },
    },
  ],
  rules: {
    'babel/object-curly-spacing': 'off',
    'brace-style': ['error', 'stroustrup'],
    'no-plusplus': 'off',
    'no-shadow': 'off',
    'padded-blocks': ['error', {classes: 'always'}],
    yoda: 'off',
  },
  settings: {
    'import/resolver': {
      node: {},
    },
  },
};
