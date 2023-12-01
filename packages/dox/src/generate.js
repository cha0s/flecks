const makeFilenameRewriter = (filenameRewriters) => (filename, line, column) => (
  Object.entries(filenameRewriters)
    .reduce(
      (filename, [from, to]) => filename.replace(new RegExp(from), to),
      `${filename}:${line}:${column}`,
    )
);

export const generateBuildConfigsPage = (buildConfigs) => {
  const source = [];
  source.push('# Build configuration files');
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

export const generateConfigPage = (configs) => {
  const source = [];
  source.push('# Configuration');
  source.push('');
  source.push('This page documents all the configuration in this project.');
  source.push('');
  Object.entries(configs)
    .sort(([l], [r]) => (l < r ? -1 : 1))
    .forEach(([fleck, configs]) => {
      // source.push(`## \`${fleck}\``);
      source.push('```javascript');
      source.push(`'${fleck}': {`);
      configs.forEach(({comment, config, defaultValue}) => {
        comment.split('\n').forEach((line) => {
          source.push(`  // ${line}`);
        });
        const value = defaultValue
          .split('\n')
          .map((line, i, array) => {
            let output = '';
            if (array.length - 1 === i) {
              output += '  ';
            }
            else if (0 !== i) {
              output += '    ';
            }
            output += line.trim();
            return output;
          })
          .join('\n');
        source.push(`  ${config}: ${value}`);
      });
      source.push('}');
      source.push('```');
    });
  return source.join('\n');
};

export const generateHookPage = (hooks, flecks) => {
  const {filenameRewriters} = flecks.get('@flecks/dox/server');
  const rewriteFilename = makeFilenameRewriter(filenameRewriters);
  const source = [];
  source.push('# Hooks');
  source.push('');
  source.push('This page documents all the hooks in this project.');
  source.push('');
  Object.entries(hooks)
    .sort(([lhook], [rhook]) => (lhook < rhook ? -1 : 1))
    .forEach(([hook, {implementations = [], invocations = [], specification}]) => {
      source.push(`## \`${hook}\``);
      source.push('');
      const {description, example, params} = specification || {
        params: [],
      };
      if (description) {
        description.split('\n').forEach((line) => {
          source.push(`> ${line}`);
        });
        source.push('');
      }
      if (params.length > 0) {
        source.push('<details>');
        source.push('<summary>Parameters</summary>');
        source.push('<ul>');
        params.forEach(({description, name, type}) => {
          source.push(`<li><strong><code>{${type}}</code></strong> <code>${name}</code>`);
          source.push(`<blockquote>${description}</blockquote></li>`);
        });
        source.push('</ul>');
        source.push('</details>');
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

export const generateTodoPage = (todos, flecks) => {
  const {filenameRewriters} = flecks.get('@flecks/dox/server');
  const rewriteFilename = makeFilenameRewriter(filenameRewriters);
  const source = [];
  source.push('# TODO');
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
