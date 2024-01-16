const makeFilenameRewriter = (filenameRewriters) => (filename, line, column) => (
  Object.entries(filenameRewriters)
    .reduce(
      (filename, [from, to]) => filename.replace(new RegExp(from), to),
      `${filename}:${line}:${column}`,
    )
);

exports.generateBuildConfigsPage = (buildConfigs) => {
  const source = [];
  source.push('# Build configuration');
  source.push('');
  source.push('This page documents all the build configuration files in this project.');
  source.push('');
  if (buildConfigs.length > 0) {
    buildConfigs
      .sort(({config: l}, {config: r}) => (l < r ? -1 : 1))
      .forEach(({config, comment}) => {
        source.push(`## \`${config}\``);
        source.push('');
        source.push(comment);
        source.push('');
      });
  }
  return source.join('\n');
};

exports.generateConfigPage = (configs) => {
  const source = [];
  source.push("const CodeBlock = require('@theme/CodeBlock');");
  source.push('');
  source.push('# Fleck configuration');
  source.push('');
  source.push('<style>td > .theme-code-block \\{ margin: 0; \\}</style>');
  source.push('');
  source.push('This page documents all configurable flecks in this project.');
  source.push('');
  Object.entries(configs)
    .sort(([l], [r]) => (l < r ? -1 : 1))
    .forEach(([fleck, configs]) => {
      source.push(`## \`${fleck}\``);
      source.push('|Name|Default|Description|');
      source.push('|-|-|-|');
      configs.forEach(({comment, config, defaultValue}) => {
        // Leading and trailing empty cell to make table rendering easier.
        const row = ['', config];
        let code = defaultValue.replace(/`/g, '\\`');
        // Multiline code. Fix indentation.
        if (defaultValue.includes('\n')) {
          const defaultValueLines = code.split('\n');
          const [first, ...rest] = defaultValueLines;
          const indent = (rest[0].length - rest[0].trimStart().length) - 2;
          code = [first, ...rest.map((line) => line.substring(indent))].join('\\n');
        }
        row.push(`<CodeBlock language="javascript">{\`${code}\`}</CodeBlock>`);
        row.push(comment, '');
        source.push(row.join('|'));
      });
      source.push('');
    });
  return source.join('\n');
};

exports.generateHookPage = (hooks, flecks) => {
  const {filenameRewriters} = flecks.get('@flecks/dox');
  const rewriteFilename = makeFilenameRewriter(filenameRewriters);
  const source = [];
  source.push('# Hooks');
  source.push('');
  source.push('This page documents all the hooks in this project.');
  source.push('');
  Object.entries(hooks)
    .sort(([lhook], [rhook]) => (lhook < rhook ? -1 : 1))
    .forEach(([hook, {implementations = [], invocations = [], specification}]) => {
      const {description, example, params} = specification || {
        params: [],
      };
      source.push(`## \`${hook}\``);
      source.push('');
      if (description) {
        source.push(...description.split('\n'));
        source.push('');
      }
      if (params.length > 0) {
        params.forEach(({description, name, type}) => {
          source.push(`### <code>${name}: ${type}</code>`);
          source.push('');
          source.push(`<p>${description.trim()}</p>`);
          source.push('');
        });
        source.push('');
      }
      if (implementations.length > 0) {
        source.push('<details>');
        source.push('<summary>Implementations</summary>');
        source.push('<ul>');
        implementations.forEach(({filename, loc: {start: {column, line}}}) => {
          source.push(`<li>${rewriteFilename(filename, line, column)}</li>`);
        });
        source.push('</ul>');
        source.push('</details>');
        source.push('');
      }
      if (invocations.length > 0) {
        source.push('<details>');
        source.push('<summary>Invocations</summary>');
        source.push('<ul>');
        invocations.forEach(({filename, loc: {start: {column, line}}}) => {
          source.push(`<li>${rewriteFilename(filename, line, column)}</li>`);
        });
        source.push('</ul>');
        source.push('</details>');
        source.push('');
      }
      if (example) {
        source.push('### Example usage');
        source.push('');
        source.push('```javascript');
        source.push('export const hooks = {');
        source.push(`  '${hook}': ${example}`);
        source.push('};');
        source.push('```');
        source.push('');
      }
    });
  return source.join('\n');
};

exports.generateTodoPage = (todos, flecks) => {
  const {filenameRewriters} = flecks.get('@flecks/dox');
  const rewriteFilename = makeFilenameRewriter(filenameRewriters);
  const source = [];
  source.push('# TODO list');
  source.push('');
  source.push('This page documents all the TODO items in this project.');
  source.push('');
  if (todos.length > 0) {
    todos.forEach(({filename, loc: {start: {column, line}}, text}) => {
      source.push(`- ${rewriteFilename(filename, line, column)}`);
      text.split('\n').forEach((line) => {
        source.push(`  > ${line}`);
      });
    });
    source.push('');
  }
  return source.join('\n');
};
