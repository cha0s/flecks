module.exports = {
  globals: {
    __non_webpack_require__: true,
    window: true,
  },
  ignorePatterns: [
    '**/dist/**',
    '/build/dox/hooks.js',
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
