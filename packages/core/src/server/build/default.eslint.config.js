const babelmerge = require('babel-merge');
const globals = require('globals');

const R = require('../../require');

module.exports = async (flecks) => {
  const merging = [
    {
      plugins: [R.resolve('@babel/plugin-syntax-dynamic-import')],
      presets: [
        [
          R.resolve('@babel/preset-env'),
          {
            shippedProposals: true,
            targets: {
              esmodules: true,
              node: 'current',
            },
          },
        ],
      ],
    },
  ];
  if (flecks) {
    merging.push({configFile: flecks.buildConfig('babel.config.js')});
    const rcBabel = flecks.babel();
    merging.push(...rcBabel.map(([, babel]) => babel));
  }
  const babelConfig = babelmerge.all(merging);
  return {
    extends: [
      R.resolve('eslint-config-airbnb'),
      R.resolve('eslint-config-airbnb/hooks'),
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
      'build/dox/hooks.js',
    ],
    overrides: [
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
    parser: R.resolve('@babel/eslint-parser'),
    parserOptions: {
      requireConfigFile: false,
      babelOptions: babelConfig,
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
        version: '17.0.1',
      },
    },
  };
};
