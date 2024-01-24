const globals = require('globals');

module.exports = ({
  extends: [
    require.resolve('eslint-config-airbnb'),
    require.resolve('eslint-config-airbnb/hooks'),
  ],
  globals: {
    ...globals.browser,
    ...globals.es2021,
    ...globals.mocha,
    ...globals.node,
    __non_webpack_require__: true,
  },
  ignorePatterns: [
    'dist/**',
    // Not even gonna try.
    'build/flecks.hooks.js',
  ],
  overrides: [
    {
      files: [
        'build/**/*.js',
      ],
      rules: {
        'import/no-extraneous-dependencies': ['error', {devDependencies: true}],
        'import/no-dynamic-require': 'off',
        'global-require': 'off',
      },
    },
    {
      files: [
        'test/**/*.js',
      ],
      rules: {
        'brace-style': 'off',
        'class-methods-use-this': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/no-unresolved': 'off',
        'max-classes-per-file': 'off',
        'no-new': 'off',
        'no-unused-expressions': 'off',
        'padded-blocks': 'off',
      },
    },
  ],
  parser: require.resolve('@babel/eslint-parser'),
  parserOptions: {
    requireConfigFile: false,
  },
  plugins: ['@babel'],
  rules: {
    'brace-style': ['error', 'stroustrup'],
    // Bug: https://github.com/import-js/eslint-plugin-import/issues/2181
    'import/no-import-module-exports': 'off',
    'import/prefer-default-export': 'off',
    'jsx-a11y/control-has-associated-label': ['error', {assert: 'either'}],
    'jsx-a11y/label-has-associated-control': ['error', {assert: 'either'}],
    'no-param-reassign': ['error', {props: false}],
    'no-plusplus': 'off',
    'no-shadow': 'off',
    'object-curly-spacing': 'off',
    'padded-blocks': ['error', {classes: 'always'}],
    yoda: 'off',
  },
  settings: {
    'import/resolver': {
      node: {},
    },
    react: {
      version: '18.2.0',
    },
  },
});
