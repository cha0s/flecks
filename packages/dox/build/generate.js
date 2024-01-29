const {
  basename,
  dirname,
  extname,
  join,
} = require('path');

const {parseFlecks} = require('./parser');

exports.generateDocusaurus = function generate({
  'build-files': buildFiles,
  config,
  hooks,
  todos,
}) {
  return {
    'build-files': exports.generateDocusaurusBuildFilesPage(buildFiles),
    config: exports.generateDocusaurusConfigPage(config),
    hooks: exports.generateDocusaurusHookPage(hooks),
    todos: exports.generateDocusaurusTodoPage(todos),
  };
};
exports.generateDocusaurusBuildFilesPage = (buildFiles) => {
  const source = [];
  source.push('---');
  source.push('title: Build files');
  source.push('description: All the build files in this project.');
  source.push('---');
  source.push('');
  source.push('This page documents all the build configuration files in this project.');
  source.push('');
  if (buildFiles.length > 0) {
    buildFiles
      .sort(({filename: l}, {filename: r}) => (l < r ? -1 : 1))
      .forEach(({filename, description}) => {
        source.push(`## \`${filename}\``);
        source.push('');
        source.push(description);
        source.push('');
      });
  }
  return source.join('\n');
};

exports.generateDocusaurusConfigPage = (configs) => {
  const source = [];
  source.push('---');
  source.push('title: Fleck configuration');
  source.push('description: All the configurable flecks in this project.');
  source.push('---');
  source.push('');
  source.push("import CodeBlock from '@theme/CodeBlock';");
  source.push('');
  source.push("import styles from './dox.module.css';");
  source.push('');
  source.push('This page documents all configurable flecks in this project.');
  source.push('');
  Object.entries(configs)
    .sort(([l], [r]) => (l < r ? -1 : 1))
    .forEach(([fleck, configs]) => {
      source.push(`## \`${fleck}\``);
      source.push('<table className={styles.configTable}>');
      source.push('<thead>');
      source.push('<td className={styles.configBig}>Description</td>');
      source.push('<td>Name</td>');
      source.push('<td>Default value</td>');
      source.push('</thead>');
      source.push('<tbody>');
      configs.forEach(({defaultValue, description, key}) => {
        // Leading and trailing empty cell to make table rendering easier.
        source.push('<tr className={styles.configSmall}><td colspan="2"></td></tr>');
        source.push(`<tr className={styles.configSmall}><td colspan="2">${description}</td></tr>`);
        source.push('<tr>');
        source.push(`<td className={styles.configBig}>${description}</td>`);
        source.push(`<td>\`${key}\`</td>`);
        let code = defaultValue.replace(/`/g, '\\`');
        // Multiline code. Fix indentation.
        if (defaultValue.includes('\n')) {
          const defaultValueLines = code.split('\n');
          const [first, ...rest] = defaultValueLines;
          const indent = (rest[0].length - rest[0].trimStart().length) - 2;
          code = [first, ...rest.map((line) => line.substring(indent))].join('\\n');
        }
        source.push(`<td><CodeBlock language="javascript">{\`${code}\`}</CodeBlock></td>`);
        source.push('</tr>');
      });
      source.push('</tbody>');
      source.push('</table>');
    });
  return source.join('\n');
};

exports.generateDocusaurusHookPage = (hooks) => {
  const source = [];
  source.push('---');
  source.push('title: Hooks');
  source.push('description: All the hooks in this project.');
  source.push('---');
  source.push('');
  source.push("import styles from './dox.module.css';");
  source.push('');
  source.push('This page documents all the hooks in this project.');
  source.push('');
  Object.entries(hooks)
    .sort(([lhook], [rhook]) => (lhook < rhook ? -1 : 1))
    .forEach(([hook, {implementations = [], invocations = [], specification}]) => {
      const {
        description,
        example,
        invoke,
        params,
      } = specification || {
        params: [],
      };
      source.push(`## \`${hook}\``);
      source.push('');
      if (invoke) {
        source.push('<h3 style={{fontSize: "1.125rem", marginTop: 0}}>');
        source.push(`[${invoke}](../hooks#${invoke.toLowerCase()})`);
        source.push('</h3>');
        source.push('');
      }
      if (description) {
        source.push(...description.split('\n'));
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
      if (params.length > 0) {
        params.forEach(({description, name, type}) => {
          source.push(`### <code>${name}: ${type}</code>`);
          source.push('');
          source.push(`<p>${description.trim()}</p>`);
          source.push('');
        });
        source.push('');
      }
      if (implementations.length > 0 || invocations.length > 0) {
        source.push('<div className={styles.hooks}>');
        if (implementations.length > 0) {
          source.push('<div>');
          source.push('<h3>Implementations</h3>');
          implementations.forEach(({filename}) => {
            source.push(`<div>${filename}</div>`);
          });
          source.push('</div>');
        }
        if (invocations.length > 0) {
          source.push('<div>');
          source.push('<h3>Invocations</h3>');
          invocations.forEach(({filename, type}) => {
            source.push(`<div>(\`${type}\`) ${filename}</div>`);
          });
          source.push('</div>');
        }
        source.push('</div>');
        source.push('\n');
      }
    });
  return source.join('\n');
};

exports.generateDocusaurusStyle = () => `
@media screen and (max-width: 640px) {
  .configBig {
    display: none;
  }
}
@media screen and (min-width: 641px) {
  .configSmall {
    display: none;
  }
}
tr.configSmall:first-child {
  display: none;
}
.configTable {
  display: table;
  table-layout: fixed;
  width: 100%;
}
.configTable td:nth-child(2) code,
.configTable td:nth-child(2) pre,
.configTable td:nth-child(3) :global(.theme-code-block),
.configTable td:nth-child(3) :global(.theme-code-block) pre {
  background-color: transparent !important;
  border: none;
  box-shadow: none;
}
.configTable td:nth-child(3) :global(.theme-code-block) {
   margin: 0;
}
.hooks > div {
  margin-bottom: var(--ifm-heading-margin-bottom);
}
.hooks > div code {
  background-color: transparent;
  border: none;
  white-space: nowrap;
}
@media screen and (min-width: 641px) {
  .hooks {
    display: flex;
  }
  .hooks > div:first-child {
    width: 50%;
  }
  .hooks > div:last-child {
    padding-left: var(--ifm-spacing-horizontal);
    width: 50%;
  }
  .hooks > div:only-child {
    padding-left: 0;
    width: 100%;
  }
}
`;

exports.generateDocusaurusTodoPage = (todos) => {
  const source = [];
  source.push('---');
  source.push('title: TODO list');
  source.push('description: All the TODO items in this project.');
  source.push('---');
  source.push('');
  source.push("import CodeBlock from '@theme/CodeBlock';");
  source.push('');
  source.push('This page documents all the TODO items in this project.');
  source.push('');
  if (todos.length > 0) {
    todos.forEach(({
      filename,
      context,
      description,
    }) => {
      source.push(filename);
      source.push(`> ## ${description}`);
      source.push(`> <CodeBlock>${context}</CodeBlock>`);
      source.push('');
    });
    source.push('');
  }
  return source.join('\n');
};

exports.generateJson = async function generate(flecks) {
  const parsed = await parseFlecks(flecks);
  const {
    buildFiles,
    config,
    hooks,
    todos,
  } = parsed
    .reduce(
      (
        r,
        [
          root,
          sources,
        ],
      ) => {
        const ensureHook = (hook) => {
          if (!r.hooks[hook]) {
            r.hooks[hook] = {
              implementations: [],
              invocations: [],
              specification: undefined,
            };
          }
        };
        sources.forEach(
          (
            [
              path,
              {
                buildFiles = [],
                config = [],
                hookImplementations = [],
                hookInvocations = [],
                hookSpecifications = [],
                todos = [],
              },
            ],
          ) => {
            r.buildFiles.push(...buildFiles);
            r.todos.push(...todos.map((todo) => ({
              ...todo,
              filename: join(root, path),
            })));
            if (config.length > 0) {
              let fleck = root;
              if ('build/flecks.bootstrap.js' !== path) {
                fleck = join(fleck, path.startsWith('src') ? path.slice(4) : path);
                fleck = join(dirname(fleck), basename(fleck, extname(fleck)));
                fleck = fleck.endsWith('/index') ? fleck.slice(0, -6) : fleck;
              }
              r.config[fleck] = config;
            }
            hookImplementations.forEach(({column, hook, line}) => {
              ensureHook(hook);
              r.hooks[hook].implementations.push({
                filename: [join(root, path), line, column].join(':'),
              });
            });
            hookInvocations.forEach(({
              column,
              hook,
              line,
              type,
            }) => {
              ensureHook(hook);
              r.hooks[hook].invocations.push({
                filename: [join(root, path), line, column].join(':'),
                type,
              });
            });
            hookSpecifications.forEach(({hook, ...specification}) => {
              ensureHook(hook);
              r.hooks[hook].specification = specification;
            });
          },
        );
        return r;
      },
      {
        buildFiles: [],
        config: {},
        hooks: {},
        todos: [],
      },
    );
  const sortedHooks = Object.fromEntries(
    Object.entries(hooks)
      .map(([hook, {implementations, invocations, specification}]) => (
        [
          hook,
          {
            implementations: implementations
              .sort(({filename: l}, {filename: r}) => (l < r ? -1 : 1)),
            invocations: invocations
              .sort(({filename: l}, {filename: r}) => (l < r ? -1 : 1)),
            specification,
          },
        ]
      ))
      .sort(([l], [r]) => (l < r ? -1 : 1)),
  );
  Object.entries(sortedHooks)
    .forEach(([hook, {specification}]) => {
      if (!specification) {
        // eslint-disable-next-line no-console
        console.warn(`Warning: no specification for hook: '${hook}'`);
      }
    });
  return {
    'build-files': buildFiles,
    config,
    hooks: sortedHooks,
    todos,
  };
};
