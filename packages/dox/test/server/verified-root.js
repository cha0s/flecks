export default [
  [
    'src/index.js',
    {
      buildFiles: [{description: undefined, filename: 'file'}],
      config: [{defaultValue: "'bar'", description: undefined, key: 'foo'}],
      hookImplementations: [
        {column: 2, hook: '@flecks/build.files', line: 2},
        {column: 2, hook: '@flecks/core.config', line: 3},
        {column: 2, hook: '@something/else', line: 6},
      ],
      hookInvocations: [
        {
          column: 2,
          hook: '@something/else',
          line: 10,
          type: 'invoke',
        },
      ],
      todos: [{context: "this.invoke('@something/blah');", description: 'Skipped cuz not class.'}],
    },
  ],
  [
    'build/flecks.hooks.js',
    {
      hookSpecifications: [
        {
          description: 'Description',
          example: '(foo, bar) => {\n    this.doSomethingTo(foo, bar);\n  }',
          hook: '@something/blah',
          params: [
            {description: 'Foo', name: 'foo', type: 'string'},
            {description: 'Bar', name: 'bar', type: 'number'},
          ],
        },
      ],
    },
  ],
];
